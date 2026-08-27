import fs from "fs";

console.log("===============================================");
console.log("RC373 COOPERATIVE ID ASSIGNMENT TRACE");
console.log("===============================================");

const roots = [
    "js",
    "components",
    "core",
    "pages",
    "services",
    "functions",
    "tools"
];

const skip = new Set([
    "node_modules",
    ".git",
    "dist",
    "build"
]);

const extensions = [
    ".js",
    ".html",
    ".json",
    ".rules"
];

const assignmentPatterns = [
    /cooperativeId\s*:/i,
    /cooperativeId\s*=/i,
    /\.cooperativeId\s*=/i,
    /["']cooperativeId["']/i,
    /userData\.cooperativeId/i,
    /userDoc.*cooperativeId/i,
    /profile.*cooperativeId/i,
    /cooperative.*profile/i
];

const files = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    const stat = fs.statSync(dir);

    if (!stat.isDirectory()) return;

    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true
    })) {
        if (skip.has(entry.name)) continue;

        const path = dir + "/" + entry.name;

        if (entry.isDirectory()) {
            walk(path);
            continue;
        }

        if (
            extensions.some(ext =>
                entry.name.endsWith(ext)
            )
        ) {
            files.push(path);
        }
    }
}

for (const root of roots) {
    walk(root);
}

const matches = [];

for (const file of files) {
    let source;

    try {
        source = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    const lines = source.split("\n");

    lines.forEach((line, index) => {
        if (
            assignmentPatterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            matches.push({
                file,
                line: index + 1,
                text: line.trim()
            });
        }
    });
}

console.log("");
console.log("FILES SCANNED:", files.length);
console.log("COOPERATIVE ID REFERENCES:", matches.length);

console.log("");
console.log("===============================================");
console.log("COOPERATIVE ID REFERENCES");
console.log("===============================================");

for (const match of matches) {
    console.log(
        match.file +
        ":" +
        match.line +
        ": " +
        match.text
    );
}

console.log("");
console.log("===============================================");
console.log("RC373 DECISION");
console.log("===============================================");

console.log(
    "RC373 FINDING: IDENTIFY WHERE cooperativeId IS ASSIGNED OR READ FROM THE AUTHORITATIVE USER/MEMBER/COOPERATIVE PROFILE."
);

console.log(
    "RC373 SECURITY REQUIREMENT: cooperativeId MUST COME FROM AN EXISTING SERVER-VERIFIABLE RELATIONSHIP."
);

console.log(
    "RC373 SECURITY REQUIREMENT: DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, adminId, OR CLIENT-SUPPLIED IDENTIFIERS."
);

console.log(
    "RC373 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC373 NEXT DECISION: USE THE EXISTING AUTHORITATIVE cooperativeId SOURCE FOR DRAW-GROUP OWNERSHIP IF IT IS SERVER-VERIFIABLE."
);

console.log("");
console.log("===============================================");
console.log("RC373 AUDIT COMPLETE");
console.log("===============================================");
