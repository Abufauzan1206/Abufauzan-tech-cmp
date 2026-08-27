import fs from "fs";

console.log("===============================================");
console.log("RC371 AUTH USER -> COOPERATIVE RESOLUTION TRACE");
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

        if (entry.name.endsWith(".js")) {
            files.push(fullPath);
        }
    }
}

for (const root of roots) {
    walk(root);
}

const patterns = [
    /auth\.currentUser/,
    /currentUser/,
    /getAuth/,
    /collection\(db, ["']users["']/,
    /collection\(db, ["']members["']/,
    /collection\(db, ["']cooperatives["']/,
    /profile/,
    /cooperativeId/,
    /memberId/,
    /adminId/,
    /uid/,
    /userId/
];

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
            patterns.some(pattern =>
                pattern.test(line)
            )
        ) {
            hits.push(index);
        }
    });

    if (hits.length === 0) continue;

    const printed = new Set();

    console.log("");
    console.log("===============================================");
    console.log(`FILE: ${file}`);
    console.log("===============================================");

    for (const index of hits) {
        const start = Math.max(0, index - 6);
        const end = Math.min(
            lines.length,
            index + 7
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
console.log("RC371 DECISION");
console.log("===============================================");

console.log(
    "RC371 FINDING: IDENTIFY THE EXISTING AUTHORITATIVE USER/MEMBER PROFILE SOURCE THAT RESOLVES cooperativeId."
);

console.log(
    "RC371 SECURITY REQUIREMENT: AUTHENTICATED uid, userId, memberId, adminId, OR groupId MUST NOT BE TREATED AS COOPERATIVE OWNERSHIP UNLESS THE APPLICATION ALREADY PROVIDES A SERVER-VERIFIABLE RELATIONSHIP."
);

console.log(
    "RC371 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC371 NEXT DECISION: USE THE EXISTING USER/MEMBER/COOPERATIVE RELATIONSHIP AS THE OWNERSHIP SOURCE FOR DRAW-GROUP CREATION IF IT IS AUTHORITATIVE AND SERVER-VERIFIABLE."
);

console.log("");
console.log("===============================================");
console.log("RC371 AUDIT COMPLETE");
console.log("===============================================");
