import fs from "fs";
import path from "path";

const targets = [
    "js",
    "modules",
    "components",
    "navigation",
    "cooperative-admin.html",
    "index.html"
];

const patterns = [
    /createDrawGroup\s*\(/i,
    /drawGroupService/i,
    /groupData/i,
    /groupForm/i,
    /create.*group/i,
    /add.*group/i,
    /submit.*group/i,
    /onclick/i,
    /addEventListener/i,
    /cooperativeId/i
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

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC392 — ACTUAL CREATE-GROUP ENTRYPOINT TRACE");
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

        const start = Math.max(0, index - 10);
        const end = Math.min(
            lines.length,
            index + 11
        );

        const key = `${start}:${end}`;

        if (printed.has(key)) continue;

        printed.add(key);

        console.log("");
        console.log(
            `--- context around line ${index + 1} ---`
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
console.log("RC392 QUESTIONS");
console.log("===============================================");
console.log(
    "1. FIND THE ACTUAL CREATE-GROUP UI HANDLER."
);
console.log(
    "2. FIND THE EXACT CALL TO createDrawGroup()."
);
console.log(
    "3. IDENTIFY THE EXACT ARGUMENT VARIABLE."
);
console.log(
    "4. TRACE WHERE THAT VARIABLE IS CONSTRUCTED."
);
console.log(
    "5. DETERMINE WHETHER cooperativeId ENTERS THAT PAYLOAD."
);
console.log(
    "6. IDENTIFY THE AUTHORITATIVE SOURCE OF cooperativeId IF ABSENT."
);
console.log(
    "7. DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);
console.log(
    "8. DO NOT CREATE ownerId, createdByUserId, OR DUPLICATE OWNERSHIP FIELDS."
);
console.log(
    "9. DO NOT MODIFY APPLICATION FILES OR FIRESTORE RULES."
);
console.log(
    "RC392 STATUS: AUDIT ONLY — NO APPLICATION FILES MODIFIED."
);
console.log("===============================================");
console.log("RC392 AUDIT COMPLETE");
console.log("===============================================");
