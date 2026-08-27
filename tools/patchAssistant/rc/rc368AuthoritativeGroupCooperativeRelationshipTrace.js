import fs from "fs";

console.log("===============================================");
console.log("RC368 AUTHORITATIVE GROUP/COOPERATIVE RELATIONSHIP TRACE");
console.log("===============================================");

const roots = [
    "js",
    "components",
    "core",
    "pages",
    "services",
    "repositories",
    "seed",
    "firestore.rules"
];

const skip = new Set([
    "node_modules",
    ".git"
]);

const extensions = [
    ".js",
    ".html",
    ".json",
    ".rules"
];

const relationshipPatterns = [
    /\bcooperativeId\b/i,
    /\bcooperative\b/i,
    /\bcooperatives\b/i,
    /\bgroupId\b/i,
    /\bgroup\b/i,
    /\bgroups\b/i,
    /\bmemberId\b/i,
    /\bmember\b/i,
    /\bmembers\b/i,
    /\badminId\b/i,
    /\bcreatedBy\b/i,
    /\bcreatedByUserId\b/i,
    /\bownerId\b/i,
    /\buserId\b/i,
    /belongsTo/i,
    /isMemberOf/i,
    /isCooperativeAdmin/i,
    /cooperative.*group/i,
    /group.*cooperative/i
];

const files = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    const stat = fs.statSync(dir);

    if (!stat.isDirectory()) {
        if (
            extensions.some(ext =>
                dir.endsWith(ext)
            )
        ) {
            files.push(dir);
        }
        return;
    }

    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true
    })) {
        if (skip.has(entry.name)) continue;

        const path = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
            walk(path);
            continue;
        }

        if (
            !extensions.some(ext =>
                entry.name.endsWith(ext)
            )
        ) {
            continue;
        }

        files.push(path);
    }
}

for (const root of roots) {
    walk(root);
}

console.log("");
console.log(`FILES SCANNED: ${files.length}`);

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
            relationshipPatterns.some(pattern =>
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

console.log(`RELATIONSHIP MATCHES: ${matches.length}`);

console.log("");
console.log("===============================================");
console.log("----- AUTHORITATIVE RELATIONSHIP REFERENCES -----");
console.log("===============================================");

for (const match of matches) {
    console.log(
        `${match.file}:${match.line}: ${match.text}`
    );
}

console.log("");
console.log("===============================================");
console.log("----- HIGH-VALUE OWNERSHIP FILES -----");
console.log("===============================================");

const highValueFiles = [
    ...new Set(
        matches
            .filter(match =>
                /cooperativeId|cooperative|belongsTo|isMemberOf|isCooperativeAdmin|groupId|memberId|createdBy|ownerId/i
                    .test(match.text)
            )
            .map(match => match.file)
    )
];

for (const file of highValueFiles) {
    console.log(file);
}

console.log("");
console.log("===============================================");
console.log("----- RELATIONSHIP CONTEXT -----");
console.log("===============================================");

for (const file of highValueFiles) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            relationshipPatterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            relevant.push(index);
        }
    });

    const printed = new Set();

    for (const index of relevant) {
        const start = Math.max(0, index - 5);
        const end = Math.min(
            lines.length,
            index + 7
        );

        const key = `${start}:${end}`;

        if (printed.has(key)) continue;

        printed.add(key);

        console.log("");
        console.log(
            `===== ${file}:${index + 1} =====`
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
console.log("----- FIRESTORE RULES OWNERSHIP CONTEXT -----");
console.log("===============================================");

if (fs.existsSync("firestore.rules")) {
    const lines = fs.readFileSync(
        "firestore.rules",
        "utf8"
    ).split("\n");

    lines.forEach((line, index) => {
        if (
            /cooperativeId|drawGroups|drawParticipants|drawBoxes|drawReservations|belongsToCooperative|isCooperativeAdmin|isMemberOfCooperative|userProfile|users/i
                .test(line)
        ) {
            const start = Math.max(0, index - 5);
            const end = Math.min(
                lines.length,
                index + 8
            );

            console.log("");
            console.log(
                `RULE CONTEXT @ LINE ${index + 1}`
            );

            for (let i = start; i < end; i++) {
                console.log(
                    `${i + 1}: ${lines[i]}`
                );
            }
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC368 DECISION");
console.log("===============================================");

console.log(
    "RC368 FINDING: THE EXISTING APPLICATION DATA MODEL MUST BE IDENTIFIED AS THE AUTHORITATIVE SOURCE OF COOPERATIVE OWNERSHIP BEFORE DRAW-GROUP OWNERSHIP IS PATCHED."
);

console.log(
    "RC368 SECURITY REQUIREMENT: DO NOT CREATE cooperativeId, ownerId, createdByUserId, OR ANY NEW OWNERSHIP FIELD IF AN EXISTING COOPERATIVE/GROUP/MEMBER RELATIONSHIP ALREADY PROVIDES THE REQUIRED AUTHORITY."
);

console.log(
    "RC368 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC368 NEXT DECISION: CLASSIFY THE EXISTING AUTHORITATIVE COOPERATIVE-TO-GROUP RELATIONSHIP AND SELECT THE SMALLEST SERVER-SIDE OWNERSHIP RESOLUTION PATH."
);

console.log("");
console.log("===============================================");
console.log("RC368 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC368: NO FILES MODIFIED");
