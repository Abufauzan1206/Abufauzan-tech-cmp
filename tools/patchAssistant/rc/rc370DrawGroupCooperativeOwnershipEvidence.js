import fs from "fs";

console.log("===============================================");
console.log("RC370 DRAW GROUP COOPERATIVE OWNERSHIP EVIDENCE");
console.log("===============================================");

const roots = [
    "js",
    "components",
    "core",
    "pages",
    "services"
];

const skip = new Set([
    "node_modules",
    ".git"
]);

const extensions = [
    ".js",
    ".html"
];

const ownershipPatterns = [
    /cooperativeId/,
    /profile\.cooperativeId/,
    /auth\.currentUser/,
    /getAuth/,
    /currentUser/,
    /collection\(db, "users"/,
    /collection\(db, "cooperatives"/,
    /drawGroups/,
    /drawGroupService/,
    /createDrawGroup/,
    /groupData/,
    /groupId/,
    /memberId/
];

const files = [];

function walk(path) {
    if (!fs.existsSync(path)) return;

    const stat = fs.statSync(path);

    if (!stat.isDirectory()) return;

    for (const entry of fs.readdirSync(path, {
        withFileTypes: true
    })) {
        if (skip.has(entry.name)) continue;

        const fullPath = `${path}/${entry.name}`;

        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        if (
            extensions.some(ext =>
                entry.name.endsWith(ext)
            )
        ) {
            files.push(fullPath);
        }
    }
}

for (const root of roots) {
    walk(root);
}

console.log("");
console.log(`FILES SCANNED: ${files.length}`);

for (const file of files) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const hits = [];

    lines.forEach((line, index) => {
        if (
            ownershipPatterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            hits.push(index);
        }
    });

    if (hits.length === 0) continue;

    console.log("");
    console.log("===============================================");
    console.log(`FILE: ${file}`);
    console.log("===============================================");

    const printed = new Set();

    for (const index of hits) {
        const start = Math.max(0, index - 5);
        const end = Math.min(
            lines.length,
            index + 6
        );

        const key = `${start}:${end}`;

        if (printed.has(key)) continue;
        printed.add(key);

        console.log("");
        console.log(
            `----- CONTEXT AROUND LINE ${index + 1} -----`
        );

        for (let i = start; i < end; i++) {
            console.log(
                `${i + 1}: ${lines[i]}`
            );
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC370 DECISION");
console.log("===============================================");

console.log(
    "RC370 FINDING: EXISTING cooperativeId RESOLUTION PATTERNS MUST BE IDENTIFIED BEFORE DRAW-GROUP OWNERSHIP IS AUTHORIZED."
);

console.log(
    "RC370 SECURITY REQUIREMENT: REUSE AN EXISTING AUTHORITATIVE COOPERATIVE RELATIONSHIP WHERE POSSIBLE; DO NOT INTRODUCE A DUPLICATE OWNER FIELD WITHOUT PROOF THAT THE EXISTING MODEL CANNOT RESOLVE OWNERSHIP."
);

console.log(
    "RC370 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC370 NEXT DECISION: CLASSIFY THE PRINTED cooperativeId/profile/group relationship AND SELECT THE SMALLEST SERVER-SIDE OWNERSHIP RESOLUTION PATCH."
);

console.log("");
console.log("===============================================");
console.log("RC370 AUDIT COMPLETE");
console.log("===============================================");
