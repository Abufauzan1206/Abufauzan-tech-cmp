import fs from "fs";

console.log("===============================================");
console.log("RC379 DRAW GROUP OWNERSHIP WRITE PATH DECISION");
console.log("===============================================");

const targets = [
    "functions/index.js",
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawReservationService.js",
    "js/business",
    "js/components",
    "js",
    "index.html",
    "firestore.rules"
];

const skip = new Set([
    "node_modules",
    ".git",
    "dist",
    "build"
]);

const extensions = new Set([
    ".js",
    ".html",
    ".json",
    ".rules"
]);

const writePatterns = [
    /collection\s*\([^)]*drawGroups/i,
    /doc\s*\([^)]*drawGroups/i,
    /drawGroups/i,
    /setDoc\s*\(/i,
    /addDoc\s*\(/i,
    /\.set\s*\(/i,
    /\.add\s*\(/i,
    /createDrawGroup\s*\(/i
];

const ownershipPatterns = [
    /cooperativeId/i,
    /groupId/i,
    /memberId/i,
    /adminId/i,
    /ownerId/i,
    /createdByUserId/i,
    /request\.auth/i,
    /auth\.currentUser/i,
    /currentUser/i
];

const files = [];

function collect(path) {
    if (!fs.existsSync(path)) return;

    const stat = fs.statSync(path);

    if (stat.isFile()) {
        if (extensions.has(path.slice(path.lastIndexOf(".")))) {
            files.push(path);
        }
        return;
    }

    if (!stat.isDirectory()) return;

    for (const entry of fs.readdirSync(path, { withFileTypes: true })) {
        if (skip.has(entry.name)) continue;

        const fullPath = `${path}/${entry.name}`;

        if (entry.isDirectory()) {
            collect(fullPath);
        } else if (
            extensions.has(
                fullPath.slice(fullPath.lastIndexOf("."))
            )
        ) {
            files.push(fullPath);
        }
    }
}

for (const target of targets) {
    collect(target);
}

const uniqueFiles = [...new Set(files)].sort();

const writeMatches = [];

for (const file of uniqueFiles) {
    let source;

    try {
        source = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    const lines = source.split("\n");

    lines.forEach((line, index) => {
        const isWrite = writePatterns.some(pattern => pattern.test(line));

        if (!isWrite) return;

        const ownershipNearby = lines
            .slice(Math.max(0, index - 12), Math.min(lines.length, index + 13))
            .some(contextLine =>
                ownershipPatterns.some(pattern => pattern.test(contextLine))
            );

        if (ownershipNearby) {
            writeMatches.push({
                file,
                line: index + 1,
                text: line.trim()
            });
        }
    });
}

console.log("");
console.log("===============================================");
console.log("POSSIBLE DRAW GROUP WRITE PATHS");
console.log("===============================================");

if (writeMatches.length === 0) {
    console.log("NO WRITE PATH MATCH FOUND.");
} else {
    for (const match of writeMatches) {
        console.log(
            `${match.file}:${match.line}: ${match.text}`
        );
    }
}

console.log("");
console.log("===============================================");
console.log("RC379 DECISION RULE");
console.log("===============================================");
console.log(
    "SELECT ONLY A REAL DRAW GROUP CREATION WRITE PATH."
);
console.log(
    "DO NOT PATCH BASED ON SERVICE NAMES OR SEARCH MATCHES ALONE."
);
console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);
console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);
console.log(
    "RC379 STATUS: AUDIT ONLY — NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC379 AUDIT COMPLETE");
console.log("===============================================");
