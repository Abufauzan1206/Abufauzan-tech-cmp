import fs from "fs";

console.log("===============================================");
console.log("RC382 DRAW GROUP DATA CONSTRUCTION TRACE");
console.log("===============================================");

const skip = new Set([
    "node_modules",
    ".git",
    "dist",
    "build"
]);

const extensions = new Set([
    ".js",
    ".html",
    ".json"
]);

const files = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    const stat = fs.statSync(dir);

    if (stat.isFile()) {
        const ext = dir.slice(dir.lastIndexOf("."));
        if (extensions.has(ext)) files.push(dir);
        return;
    }

    if (!stat.isDirectory()) return;

    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true
    })) {
        if (skip.has(entry.name)) continue;

        const path = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
            walk(path);
        } else {
            const ext = path.slice(path.lastIndexOf("."));
            if (extensions.has(ext)) files.push(path);
        }
    }
}

walk(".");

const callMatches = [];

for (const file of [...new Set(files)].sort()) {
    let source;

    try {
        source = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    const lines = source.split("\n");

    lines.forEach((line, index) => {
        if (/createDrawGroup\s*\(/i.test(line)) {
            callMatches.push({
                file,
                line: index + 1,
                text: line.trim()
            });
        }
    });
}

console.log("");
console.log("===============================================");
console.log("createDrawGroup CALLERS");
console.log("===============================================");

for (const match of callMatches) {
    console.log(
        `${match.file}:${match.line}: ${match.text}`
    );
}

console.log("");
console.log("===============================================");
console.log("CALLER CONTEXT");
console.log("===============================================");

for (const match of callMatches) {
    const lines = fs.readFileSync(
        match.file,
        "utf8"
    ).split("\n");

    const index = match.line - 1;

    const start = Math.max(0, index - 30);
    const end = Math.min(lines.length, index + 45);

    console.log("");
    console.log(
        `===== ${match.file}:${match.line} =====`
    );

    for (let i = start; i < end; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
}

console.log("");
console.log("===============================================");
console.log("COOPERATIVE OWNERSHIP SOURCES IN CALLERS");
console.log("===============================================");

const ownershipPatterns = [
    /\bcooperativeId\b/i,
    /\bcooperative\b/i,
    /profile\.cooperativeId/i,
    /currentUser/i,
    /getAuth/i,
    /auth\.currentUser/i,
    /\buid\b/i,
    /\bgroupId\b/i,
    /\bmemberId\b/i,
    /\badminId\b/i,
    /\bownerId\b/i,
    /\bcreatedByUserId\b/i
];

for (const match of callMatches) {
    const lines = fs.readFileSync(
        match.file,
        "utf8"
    ).split("\n");

    const index = match.line - 1;

    const start = Math.max(0, index - 30);
    const end = Math.min(lines.length, index + 45);

    for (let i = start; i < end; i++) {
        if (
            ownershipPatterns.some(
                pattern => pattern.test(lines[i])
            )
        ) {
            console.log(
                `${match.file}:${i + 1}: ${lines[i].trim()}`
            );
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC382 DECISION RULE");
console.log("===============================================");

console.log(
    "TRACE groupData TO ITS AUTHORITATIVE CONSTRUCTION SOURCE."
);

console.log(
    "DO NOT PATCH createDrawGroup() UNTIL THE CALLER CONTRACT IS UNDERSTOOD."
);

console.log(
    "REUSE AN EXISTING AUTHORITATIVE cooperativeId SOURCE."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "RC382 STATUS: AUDIT ONLY — NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC382 AUDIT COMPLETE");
console.log("===============================================");
