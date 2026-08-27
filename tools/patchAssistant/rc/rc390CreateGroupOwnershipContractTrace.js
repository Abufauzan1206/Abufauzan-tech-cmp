import fs from "fs";
import path from "path";

const targets = [
    "js/cooperative-admin.js",
    "js/services/drawGroupService.js",
    "cooperative-admin.html",
    "modules/register-cooperative/service.js",
    "modules/register-cooperative/validator.js"
];

const patterns = [
    /auth\.currentUser/i,
    /onAuthStateChanged/i,
    /users\//i,
    /getDoc\s*\(/i,
    /doc\s*\(/i,
    /userDoc/i,
    /userData/i,
    /profile/i,
    /cooperativeId/i,
    /createDrawGroup/i,
    /createGroup/i,
    /groupForm/i,
    /groupData/i,
    /drawGroup/i,
    /role/i
];

function collect(target, files = []) {
    if (!fs.existsSync(target)) return files;

    const stat = fs.statSync(target);

    if (stat.isFile()) {
        files.push(target);
        return files;
    }

    for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
        if (
            entry.name === "node_modules" ||
            entry.name === ".git"
        ) {
            continue;
        }

        collect(
            path.join(target, entry.name),
            files
        );
    }

    return files;
}

console.log("");
console.log("===============================================");
console.log("RC390 CREATE-GROUP OWNERSHIP CONTRACT TRACE");
console.log("===============================================");

const files = [];

for (const target of targets) {
    collect(target, files);
}

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
            `--- context around line ${index + 1} ---`
        );

        for (let i = start; i < end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC390 OWNERSHIP CONTRACT QUESTIONS");
console.log("===============================================");

console.log(
    "1. IDENTIFY THE EXACT PROFILE OBJECT USED BY THE COOPERATIVE ADMIN DASHBOARD."
);

console.log(
    "2. IDENTIFY WHETHER THAT PROFILE OBJECT CONTAINS cooperativeId."
);

console.log(
    "3. IDENTIFY THE EXACT CREATE-GROUP ENTRY POINT."
);

console.log(
    "4. IDENTIFY THE EXACT PAYLOAD PASSED TO createDrawGroup()."
);

console.log(
    "5. DETERMINE WHETHER cooperativeId IS ALREADY PRESENT IN THAT PAYLOAD."
);

console.log(
    "6. IF ABSENT, TRACE THE EXISTING AUTHORITATIVE PROFILE/COOPERATIVE SOURCE."
);

console.log(
    "7. DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, adminId, OR CLIENT-GENERATED IDENTIFIERS."
);

console.log(
    "8. DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "9. DO NOT MODIFY createDrawGroup(), cooperative-admin.js, OR FIRESTORE RULES IN RC390."
);

console.log(
    "RC390 STATUS: AUDIT ONLY — NO APPLICATION FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC390 AUDIT COMPLETE");
console.log("===============================================");
