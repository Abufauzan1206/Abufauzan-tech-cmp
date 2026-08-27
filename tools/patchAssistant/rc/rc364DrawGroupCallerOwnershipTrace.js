import fs from "fs";

console.log("===============================================");
console.log("RC364 DRAW GROUP CALLER OWNERSHIP TRACE");
console.log("===============================================");

const rootDirs = [
    "js",
    "components",
    "core",
    "services",
    "pages",
    "tools"
];

const skipDirs = new Set([
    "node_modules",
    ".git"
]);

const extensions = [".js", ".html"];

const matches = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (skipDirs.has(entry.name)) continue;

        const fullPath = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        if (!extensions.some(ext => entry.name.endsWith(ext))) {
            continue;
        }

        let source;

        try {
            source = fs.readFileSync(fullPath, "utf8");
        } catch {
            continue;
        }

        const lines = source.split("\n");

        lines.forEach((line, index) => {
            if (
                /createDrawGroup\s*\(/.test(line) ||
                /drawGroupService/.test(line) ||
                /groupData/.test(line)
            ) {
                matches.push({
                    file: fullPath,
                    line: index + 1,
                    text: line.trim()
                });
            }
        });
    }
}

for (const dir of rootDirs) {
    walk(dir);
}

console.log("");
console.log("----- ALL createDrawGroup CALLERS / REFERENCES -----");

for (const match of matches) {
    console.log(
        `${match.file}:${match.line}: ${match.text}`
    );
}

console.log("");
console.log("===============================================");
console.log("----- CALLER CONTEXT -----");
console.log("===============================================");

const callerFiles = [
    ...new Set(
        matches
            .filter(match =>
                /createDrawGroup\s*\(/.test(match.text)
            )
            .map(match => match.file)
    )
];

if (callerFiles.length === 0) {
    console.log("NO createDrawGroup CALLER FOUND");
}

for (const file of callerFiles) {
    console.log("");
    console.log(`===== ${file} =====`);

    const lines = fs.readFileSync(file, "utf8").split("\n");

    const callerLines = [];

    lines.forEach((line, index) => {
        if (/createDrawGroup\s*\(/.test(line)) {
            callerLines.push(index);
        }
    });

    for (const index of callerLines) {
        console.log("");
        console.log(`CALL @ LINE ${index + 1}`);

        const start = Math.max(0, index - 12);
        const end = Math.min(lines.length, index + 18);

        for (let i = start; i < end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}

console.log("");
console.log("===============================================");
console.log("----- OWNERSHIP SIGNALS IN CALLERS -----");
console.log("===============================================");

const ownershipPatterns = [
    /\bcooperativeId\b/,
    /\bgroupId\b/,
    /\bmemberId\b/,
    /\bparticipantId\b/,
    /\badminId\b/,
    /\bcreatedBy\b/,
    /\bcreatedByUserId\b/,
    /\bownerId\b/,
    /\buserId\b/,
    /auth\.currentUser/,
    /userProfile/,
    /users/,
    /cooperatives/
];

for (const file of callerFiles) {
    console.log("");
    console.log(`===== ${file} =====`);

    const lines = fs.readFileSync(file, "utf8").split("\n");

    lines.forEach((line, index) => {
        if (ownershipPatterns.some(pattern => pattern.test(line))) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("");
console.log("===============================================");
console.log("----- CREATE PAYLOAD CLASSIFICATION -----");
console.log("===============================================");

console.log("");
console.log("QUESTION 1:");
console.log(
    "Does the createDrawGroup caller explicitly supply cooperativeId?"
);

console.log("");
console.log("QUESTION 2:");
console.log(
    "Does the caller derive cooperativeId from the authenticated user's authoritative profile?"
);

console.log("");
console.log("QUESTION 3:");
console.log(
    "Does the caller supply only groupId/memberId/adminId/userId without an authoritative cooperative relationship?"
);

console.log("");
console.log("QUESTION 4:");
console.log(
    "Is there already an authoritative group-to-cooperative relationship elsewhere in the application?"
);

console.log("");
console.log("===============================================");
console.log("RC364 DECISION");
console.log("===============================================");

console.log(
    "RC364 FINDING: THE createDrawGroup CALLER IS THE NEXT AUTHORITATIVE APPLICATION-LAYER EVIDENCE SOURCE."
);

console.log(
    "RC364 SECURITY REQUIREMENT: DO NOT TREAT groupId, adminId, memberId, OR userId AS PROOF OF COOPERATIVE OWNERSHIP WITHOUT A SERVER-VERIFIABLE RELATIONSHIP."
);

console.log(
    "RC364 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC364 NEXT DECISION: IF THE CALLER ALREADY SUPPLIES AUTHORITATIVE cooperativeId, REUSE IT; OTHERWISE IDENTIFY THE SMALLEST TRUSTWORTHY OWNERSHIP SOURCE BEFORE PATCHING."
);

console.log("");
console.log("===============================================");
console.log("RC364 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC364: NO FILES MODIFIED");
