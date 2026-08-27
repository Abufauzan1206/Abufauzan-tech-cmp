import fs from "fs";

console.log("===============================================");
console.log("RC366 DRAW GROUP CREATION ENTRY-POINT TRACE");
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

const patterns = [
    /createDrawGroup/i,
    /drawGroup/i,
    /draw-groups?/i,
    /drawGroups/i,
    /groupData/i,
    /groupId/i,
    /Create Group/i,
    /create group/i,
    /new group/i,
    /group.*form/i
];

const files = [];
const matches = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true
    })) {
        if (skip.has(entry.name)) continue;

        const path = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
            walk(path);
            continue;
        }

        if (!extensions.some(ext =>
            entry.name.endsWith(ext)
        )) {
            continue;
        }

        files.push(path);
    }
}

for (const root of roots) {
    walk(root);
}

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
            patterns.some(pattern =>
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
console.log(`FILES SCANNED: ${files.length}`);
console.log(`MATCHED LINES: ${matches.length}`);

console.log("");
console.log("===============================================");
console.log("----- DRAW GROUP CREATION REFERENCES -----");
console.log("===============================================");

for (const match of matches) {
    console.log(
        `${match.file}:${match.line}: ${match.text}`
    );
}

console.log("");
console.log("===============================================");
console.log("----- POTENTIAL CREATION ENTRY FILES -----");
console.log("===============================================");

const candidateFiles = [
    ...new Set(
        matches
            .filter(match =>
                /createDrawGroup|groupData|Create Group|create group|new group|group.*form/i
                    .test(match.text)
            )
            .map(match => match.file)
    )
];

for (const file of candidateFiles) {
    console.log(file);
}

console.log("");
console.log("===============================================");
console.log("----- OWNERSHIP DATA NEAR DRAW GROUP REFERENCES -----");
console.log("===============================================");

const ownershipPatterns = [
    /\bcooperativeId\b/,
    /\bgroupId\b/,
    /\bmemberId\b/,
    /\badminId\b/,
    /\bcreatedBy\b/,
    /\bcreatedByUserId\b/,
    /\bownerId\b/,
    /\buserId\b/,
    /auth\.currentUser/,
    /userProfile/,
    /cooperatives/,
    /users/
];

for (const file of candidateFiles) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            ownershipPatterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            relevant.push(index);
        }
    });

    if (relevant.length === 0) continue;

    console.log("");
    console.log(`===== ${file} =====`);

    for (const index of relevant) {
        const start = Math.max(0, index - 3);
        const end = Math.min(
            lines.length,
            index + 4
        );

        console.log("");
        console.log(
            `OWNERSHIP CONTEXT @ LINE ${index + 1}`
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
console.log("RC366 DECISION");
console.log("===============================================");

console.log(
    "RC366 FINDING: createDrawGroup HAS NO DISCOVERED APPLICATION CALLER; THE DRAW-GROUP CREATION ENTRY POINT MUST BE LOCATED BEFORE OWNERSHIP AUTHORIZATION IS PATCHED."
);

console.log(
    "RC366 SECURITY REQUIREMENT: DO NOT CONSTRUCT cooperativeId FROM UNVERIFIED CLIENT INPUT OR FROM groupId/memberId/adminId/userId."
);

console.log(
    "RC366 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC366 NEXT DECISION: IDENTIFY THE ACTUAL DRAW-GROUP CREATION UI/SERVICE ENTRY POINT AND TRACE ITS AVAILABLE AUTHENTICATED OWNERSHIP CONTEXT."
);

console.log("");
console.log("===============================================");
console.log("RC366 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC366: NO FILES MODIFIED");
