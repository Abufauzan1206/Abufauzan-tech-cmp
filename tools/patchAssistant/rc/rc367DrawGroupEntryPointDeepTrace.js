import fs from "fs";

console.log("===============================================");
console.log("RC367 DRAW GROUP ENTRY-POINT DEEP TRACE");
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
    /drawGroupService/i,
    /createDrawGroup/i,
    /drawGroups/i,
    /groupData/i,
    /groupName/i,
    /group.*create/i,
    /create.*group/i,
    /new.*group/i,
    /add.*group/i,
    /save.*group/i,
    /submit.*group/i
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
console.log("----- DRAW GROUP ENTRY REFERENCES -----");
console.log("===============================================");

for (const match of matches) {
    console.log(
        `${match.file}:${match.line}: ${match.text}`
    );
}

console.log("");
console.log("===============================================");
console.log("----- CANDIDATE ENTRY FILES -----");
console.log("===============================================");

const candidateFiles = [
    ...new Set(
        matches
            .filter(match =>
                /groupName|group.*create|create.*group|new.*group|add.*group|save.*group|submit.*group|drawGroups|drawGroupService/i
                    .test(match.text)
            )
            .map(match => match.file)
    )
];

if (candidateFiles.length === 0) {
    console.log("NO CANDIDATE ENTRY FILES FOUND");
}

for (const file of candidateFiles) {
    console.log(file);
}

console.log("");
console.log("===============================================");
console.log("----- CANDIDATE CONTEXT -----");
console.log("===============================================");

for (const file of candidateFiles) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            patterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            relevant.push(index);
        }
    });

    for (const index of relevant) {
        console.log("");
        console.log(
            `===== ${file}:${index + 1} =====`
        );

        const start = Math.max(0, index - 12);
        const end = Math.min(
            lines.length,
            index + 20
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
console.log("----- AUTHENTICATION / OWNERSHIP SIGNALS -----");
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
    /getAuth/,
    /currentUser/,
    /userProfile/,
    /getUserProfile/,
    /users/,
    /cooperatives/
];

for (const file of candidateFiles) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const found = [];

    lines.forEach((line, index) => {
        if (
            ownershipPatterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            found.push(index);
        }
    });

    if (found.length === 0) continue;

    console.log("");
    console.log(`===== ${file} =====`);

    for (const index of found) {
        const start = Math.max(0, index - 3);
        const end = Math.min(
            lines.length,
            index + 4
        );

        console.log("");
        console.log(
            `OWNERSHIP SIGNAL @ LINE ${index + 1}`
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
console.log("RC367 DECISION");
console.log("===============================================");

console.log(
    "RC367 FINDING: TRACE ALL DRAW-GROUP CREATION ENTRY REFERENCES BEFORE MODIFYING OWNERSHIP OR FIRESTORE RULES."
);

console.log(
    "RC367 SECURITY REQUIREMENT: AUTHENTICATED USER CONTEXT AND EXISTING cooperativeId RELATIONSHIPS MUST BE IDENTIFIED FROM AUTHORITATIVE APPLICATION DATA; DO NOT INFER OWNERSHIP FROM IDENTIFIERS."
);

console.log(
    "RC367 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC367 NEXT DECISION: IDENTIFY THE REAL DRAW-GROUP CREATION ENTRY POINT AND DETERMINE WHETHER ITS EXISTING PAYLOAD ALREADY CONTAINS OR CAN AUTHORITATIVELY RESOLVE cooperativeId."
);

console.log("");
console.log("===============================================");
console.log("RC367 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC367: NO FILES MODIFIED");
