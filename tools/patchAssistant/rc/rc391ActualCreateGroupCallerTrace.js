import fs from "fs";
import path from "path";

const roots = [
    "js",
    "modules",
    "."
];

const patterns = [
    /createDrawGroup\s*\(/i,
    /drawGroupService/i,
    /groupData/i,
    /createGroup/i,
    /groupForm/i,
    /drawGroups/i,
    /cooperativeId/i,
    /userData/i,
    /userDoc/i,
    /auth\\.currentUser/i,
    /onAuthStateChanged/i
];

const files = [];
const seen = new Set();

function collect(target) {
    if (!fs.existsSync(target)) return;

    const resolved = path.resolve(target);

    if (seen.has(resolved)) return;
    seen.add(resolved);

    const stat = fs.statSync(target);

    if (stat.isFile()) {
        if (
            (target.endsWith(".js") || target.endsWith(".html")) &&
            !target.includes("node_modules") &&
            !target.includes(".git") &&
            !target.includes("patchAssistant/rc")
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
            entry.name === ".git" ||
            entry.name === "patchAssistant"
        ) {
            continue;
        }

        collect(path.join(target, entry.name));
    }
}

for (const root of roots) {
    collect(root);
}

console.log("");
console.log("===============================================");
console.log("RC391 ACTUAL CREATE-GROUP CALLER + PAYLOAD TRACE");
console.log("===============================================");

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
        if (patterns.some(pattern => pattern.test(line))) {
            matches.push({
                file,
                index,
                lines
            });
        }
    });
}

for (const match of matches) {
    const {
        file,
        index,
        lines
    } = match;

    console.log("");
    console.log("===============================================");
    console.log(`FILE: ${file}`);
    console.log("===============================================");

    const start = Math.max(0, index - 10);
    const end = Math.min(lines.length, index + 11);

    for (let i = start; i < end; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
}

console.log("");
console.log("===============================================");
console.log("RC391 DECISION QUESTIONS");
console.log("===============================================");

console.log(
    "1. IDENTIFY THE ACTUAL CALLER OF createDrawGroup()."
);

console.log(
    "2. IDENTIFY THE EXACT VARIABLE USED AS THE createDrawGroup() ARGUMENT."
);

console.log(
    "3. PRINT THE FULL CONSTRUCTION PATH OF THAT PAYLOAD."
);

console.log(
    "4. DETERMINE WHETHER cooperativeId IS ALREADY PRESENT."
);

console.log(
    "5. IF cooperativeId IS ABSENT, IDENTIFY THE EXISTING AUTHORITATIVE USER/COOPERATIVE RELATIONSHIP."
);

console.log(
    "6. DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, adminId, OR CLIENT-GENERATED IDENTIFIERS."
);

console.log(
    "7. DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "8. DO NOT MODIFY APPLICATION FILES OR FIRESTORE RULES IN RC391."
);

console.log(
    "RC391 STATUS: AUDIT ONLY — NO APPLICATION FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC391 AUDIT COMPLETE");
console.log("===============================================");
