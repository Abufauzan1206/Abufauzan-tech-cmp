import fs from "fs";

console.log("===============================================");
console.log("RC361 DRAW GROUP → COOPERATIVE OWNERSHIP PATH AUDIT");
console.log("===============================================");

const roots = [
    "js",
    "tools"
];

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawReservationService.js",
    "js/services/drawPreparationService.js"
];

function walk(dir) {
    if (!fs.existsSync(dir)) return [];

    const result = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (
            entry.name === "node_modules" ||
            entry.name === ".git"
        ) continue;

        const full = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
            result.push(...walk(full));
        } else if (
            entry.name.endsWith(".js") ||
            entry.name.endsWith(".mjs")
        ) {
            result.push(full);
        }
    }

    return result;
}

const files = [
    ...new Set(roots.flatMap(root => walk(root)))
];

console.log("");
console.log("----- GROUP / COOPERATIVE OWNERSHIP SIGNALS -----");

const signals = [
    "createGroup",
    "createCooperative",
    "groupId",
    "cooperativeId",
    "cooperative",
    "groups",
    "memberId",
    "profile.cooperativeId",
    "userProfile().data.cooperativeId",
    "isMemberOfCooperative",
    "belongsToCooperative"
];

for (const signal of signals) {
    console.log("");
    console.log(`===== SIGNAL: ${signal} =====`);

    let count = 0;

    for (const file of files) {
        const lines = fs.readFileSync(file, "utf8").split("\n");

        lines.forEach((line, index) => {
            if (line.includes(signal)) {
                count++;

                console.log(
                    `${file}:${index + 1}: ${line.trim()}`
                );
            }
        });
    }

    console.log(`TOTAL: ${count}`);
}

console.log("");
console.log("===============================================");
console.log("----- POSSIBLE GROUP COLLECTIONS -----");
console.log("===============================================");

const collectionRegex =
    /collection\(\s*[^,]+,\s*["'`](groups|cooperatives|drawGroups)["'`]\s*\)/;

for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split("\n");

    lines.forEach((line, index) => {
        if (
            collectionRegex.test(line) ||
            /["'`](groups|cooperatives)["'`]/.test(line)
        ) {
            console.log(
                `${file}:${index + 1}: ${line.trim()}`
            );
        }
    });
}

console.log("");
console.log("===============================================");
console.log("----- DRAW GROUP WRITE CALLERS -----");
console.log("===============================================");

const functions = [
    "createDrawGroup",
    "updateGroupStatus"
];

for (const fn of functions) {
    console.log("");
    console.log(`===== ${fn} =====`);

    let count = 0;

    for (const file of files) {
        if (targets.includes(file)) continue;

        const lines = fs.readFileSync(file, "utf8").split("\n");

        lines.forEach((line, index) => {
            if (line.includes(`${fn}(`)) {
                count++;

                const start = Math.max(0, index - 20);
                const end = Math.min(lines.length, index + 30);

                console.log("");
                console.log(`FILE: ${file}`);
                console.log(`CALL LINE: ${index + 1}`);

                for (let i = start; i < end; i++) {
                    console.log(`${i + 1}: ${lines[i]}`);
                }
            }
        });
    }

    console.log(`TOTAL CALL-SITE REFERENCES: ${count}`);
}

console.log("");
console.log("===============================================");
console.log("----- FIRESTORE GROUP RULE / SCHEMA SIGNALS -----");
console.log("===============================================");

if (fs.existsSync("firestore.rules")) {
    const lines = fs.readFileSync(
        "firestore.rules",
        "utf8"
    ).split("\n");

    lines.forEach((line, index) => {
        if (
            /match \/groups|match \/cooperatives|groups|cooperatives|cooperativeId|groupId/.test(
                line
            )
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
} else {
    console.log("firestore.rules: NOT FOUND");
}

console.log("");
console.log("===============================================");
console.log("RC361 DECISION");
console.log("===============================================");

console.log(
    "RC361 FINDING: IDENTIFY WHETHER GROUP DOCUMENTS ALREADY PROVIDE AN AUTHORITATIVE cooperativeId RELATIONSHIP."
);

console.log(
    "RC361 SECURITY REQUIREMENT: DO NOT ADD cooperativeId TO DRAW DOCUMENTS UNTIL THE EXISTING GROUP OWNERSHIP MODEL HAS BEEN EXAMINED."
);

console.log(
    "RC361 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC361 NEXT DECISION: USE THE DISCOVERED GROUP OWNERSHIP PATH TO DEFINE THE FINAL DRAW AUTHORIZATION CONDITIONS."
);

console.log("");
console.log("===============================================");
console.log("RC361 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC361: NO FILES MODIFIED");
