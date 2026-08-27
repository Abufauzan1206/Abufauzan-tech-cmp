import fs from "fs";
import path from "path";

const targets = [
    "cooperative-admin.html",
    "js",
    "modules"
];

const patterns = [
    /users/,
    /getDoc\s*\(/i,
    /doc\s*\(/i,
    /user\.uid/i,
    /auth\.currentUser/i,
    /onAuthStateChanged/i,
    /cooperativeId/i,
    /cooperative-admin/i,
    /create-group/i,
    /createDrawGroup/i
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
console.log("RC387 COOPERATIVE ADMIN → CREATE GROUP TRACE");
console.log("===============================================");

for (const file of files) {

    let source;

    try {
        source = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    const lines = source.split("\n");

    const matches = [];

    lines.forEach((line, index) => {
        if (
            patterns.some(pattern => pattern.test(line))
        ) {
            matches.push(index);
        }
    });

    if (matches.length === 0) continue;

    console.log("");
    console.log("===============================================");
    console.log(`FILE: ${file}`);
    console.log("===============================================");

    const printed = new Set();

    for (const index of matches) {

        const start = Math.max(0, index - 8);
        const end = Math.min(
            lines.length,
            index + 9
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
console.log("RC387 DECISION");
console.log("===============================================");

console.log(
    "TRACE THE ACTUAL COOPERATIVE ADMIN DASHBOARD IMPLEMENTATION."
);

console.log(
    "IDENTIFY HOW THE DASHBOARD RESOLVES users/{uid}."
);

console.log(
    "IDENTIFY WHETHER THE RESOLVED PROFILE CONTAINS cooperativeId."
);

console.log(
    "TRACE HOW THAT cooperativeId CAN REACH THE CREATE-GROUP HANDLER."
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
    "RC387 STATUS: AUDIT ONLY — NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC387 AUDIT COMPLETE");
console.log("===============================================");
