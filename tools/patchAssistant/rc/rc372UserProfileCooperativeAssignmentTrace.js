import fs from "fs";

console.log("===============================================");
console.log("RC372 USER PROFILE -> COOPERATIVE ASSIGNMENT TRACE");
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

const patterns = [
    /cooperativeId/i,
    /users\\s*[,)]/i,
    /collection\s*\(\s*db\s*,\s*["']users["']/i,
    /doc\s*\(\s*db\s*,\s*["']users["']/i,
    /userDoc/i,
    /userData/i,
    /profile/i,
    /memberId/i,
    /cooperative/i
];

const files = [];
const matches = [];

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
console.log("FILES SCANNED:", files.length);
console.log("MATCHED LINES:", matches.length);

console.log("");
console.log("===============================================");
console.log("USER / PROFILE / COOPERATIVE REFERENCES");
console.log("===============================================");

for (const match of matches) {
    console.log(
        match.file + ":" +
        match.line + ": " +
        match.text
    );
}

console.log("");
console.log("===============================================");
console.log("TARGETED PROFILE CONTEXT");
console.log("===============================================");

const profileFiles = [
    ...new Set(
        matches
            .filter(match =>
                /cooperativeId|userDoc|userData|profile|collection.*users|doc.*users|memberId/i
                    .test(match.text)
            )
            .map(match => match.file)
    )
];

for (const file of profileFiles) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            /cooperativeId|userDoc|userData|profile|collection.*users|doc.*users|memberId/i
                .test(line)
        ) {
            relevant.push(index);
        }
    });

    for (const index of relevant) {
        console.log("");
        console.log(
            "===== " +
            file +
            ":" +
            (index + 1) +
            " ====="
        );

        const start = Math.max(0, index - 8);
        const end = Math.min(
            lines.length,
            index + 15
        );

        for (let i = start; i < end; i++) {
            console.log(
                (i + 1) +
                ": " +
                lines[i]
            );
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC372 DECISION");
console.log("===============================================");

console.log(
    "RC372 FINDING: DETERMINE WHETHER users/{uid} ALREADY PROVIDES AN AUTHORITATIVE cooperativeId AND TRACE WHERE THAT VALUE IS CREATED, VERIFIED, OR UPDATED."
);

console.log(
    "RC372 SECURITY REQUIREMENT: cooperativeId MUST COME FROM AN EXISTING SERVER-VERIFIABLE USER/MEMBER/COOPERATIVE RELATIONSHIP; IT MUST NOT BE DERIVED FROM uid, groupId, memberId, adminId, OR CLIENT-SUPPLIED IDENTIFIERS."
);

console.log(
    "RC372 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC372 NEXT DECISION: IF users/{uid}.cooperativeId IS AUTHORITATIVE, REUSE THAT RELATIONSHIP FOR DRAW-GROUP CREATION; OTHERWISE TRACE THE EXISTING MEMBER/COOPERATIVE OWNERSHIP SOURCE."
);

console.log("");
console.log("===============================================");
console.log("RC372 AUDIT COMPLETE");
console.log("===============================================");
