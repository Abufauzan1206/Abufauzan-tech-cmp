import fs from "fs";
import path from "path";

const targets = [
    "super-admin.js",
    "cooperative-admin.js",
    "admin.js",
    "dashboard.js",
    "js",
    "modules"
];

const patterns = [
    /doc\s*\(\s*db\s*,\s*["']users["']/i,
    /getDoc\s*\(/i,
    /user\.uid/i,
    /auth\.currentUser/i,
    /onAuthStateChanged/i,
    /cooperativeId/i,
    /role/i
];

const files = [];

function collect(target) {
    if (!fs.existsSync(target)) return;

    const stat = fs.statSync(target);

    if (stat.isFile()) {
        if (
            target.endsWith(".js") ||
            target.endsWith(".html")
        ) {
            files.push(target);
        }
        return;
    }

    for (const entry of fs.readdirSync(target, {
        withFileTypes: true
    })) {
        if (
            entry.name === "node_modules" ||
            entry.name === ".git"
        ) {
            continue;
        }

        collect(path.join(target, entry.name));
    }
}

for (const target of targets) {
    collect(target);
}

console.log("");
console.log("===============================================");
console.log("RC386 COOPERATIVE ADMIN PROFILE IMPLEMENTATION");
console.log("===============================================");

console.log("");
console.log("===============================================");
console.log("ACTUAL APPLICATION PROFILE REFERENCES");
console.log("===============================================");

for (const file of files) {

    let source;

    try {
        source = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    const lines = source.split("\n");

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            patterns.some(pattern => pattern.test(line))
        ) {
            relevant.push(index);
        }
    });

    if (relevant.length === 0) continue;

    console.log("");
    console.log(`===== ${file} =====`);

    const printed = new Set();

    for (const index of relevant) {

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
            `--- context around line ${index + 1} ---`
        );

        for (let i = start; i < end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC386 DECISION");
console.log("===============================================");

console.log(
    "IDENTIFY THE REAL APPLICATION FILE THAT LOADS users/{uid}."
);

console.log(
    "IDENTIFY THE EXACT PROFILE OBJECT USED BY THE COOPERATIVE ADMIN DASHBOARD."
);

console.log(
    "DETERMINE WHETHER THAT PROFILE OBJECT ALREADY CONTAINS cooperativeId."
);

console.log(
    "IF IT DOES, REUSE THAT SAME SOURCE FOR DRAW GROUP CREATION."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "DO NOT MODIFY createDrawGroup() OR FIRESTORE RULES YET."
);

console.log(
    "RC386 STATUS: AUDIT ONLY — NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC386 AUDIT COMPLETE");
console.log("===============================================");
