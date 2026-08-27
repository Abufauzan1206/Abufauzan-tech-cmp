import fs from "fs";

const root = ".";

const skip = new Set([
    ".git",
    "node_modules",
    "dist",
    "build",
    ".firebase"
]);

const patterns = [
    /userProfile/i,
    /cooperativeId/i,
    /getDoc/i,
    /getDocs/i,
    /doc\(/i,
    /collection\(/i,
    /currentUser/i,
    /auth\.currentUser/i,
    /onAuthStateChanged/i,
    /firebase-auth/i,
    /users/i
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

        if (!/\.(js|html|rules|json)$/.test(entry.name)) {
            continue;
        }

        files.push(path);
    }
}

walk(root);

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
console.log("===============================================");
console.log("RC384 AUTHORITATIVE COOPERATIVE PROFILE TRACE");
console.log("===============================================");

console.log("");
console.log("===============================================");
console.log("PROFILE / COOPERATIVE ID REFERENCES");
console.log("===============================================");

for (const match of matches) {
    console.log(
        `${match.file}:${match.line}: ${match.text}`
    );
}

const candidateFiles = [
    ...new Set(
        matches
            .filter(match =>
                /userProfile|cooperativeId|currentUser|onAuthStateChanged|users/i
                    .test(match.text)
            )
            .map(match => match.file)
    )
];

console.log("");
console.log("===============================================");
console.log("TARGETED AUTHORITATIVE PROFILE CONTEXT");
console.log("===============================================");

for (const file of candidateFiles) {
    let lines;

    try {
        lines = fs.readFileSync(file, "utf8").split("\n");
    } catch {
        continue;
    }

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            /userProfile|cooperativeId|currentUser|onAuthStateChanged/i
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

        const start = Math.max(
            0,
            index - 15
        );

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
console.log("RC384 DECISION RULE");
console.log("===============================================");

console.log(
    "IDENTIFY THE EXISTING AUTHORITATIVE USER PROFILE SOURCE."
);

console.log(
    "CONFIRM WHERE cooperativeId IS STORED AND HOW THE CLIENT CURRENTLY READS IT."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "DO NOT MODIFY createDrawGroup() OR FIRESTORE RULES IN RC384."
);

console.log(
    "RC384 STATUS: AUDIT ONLY — NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC384 AUDIT COMPLETE");
console.log("===============================================");
