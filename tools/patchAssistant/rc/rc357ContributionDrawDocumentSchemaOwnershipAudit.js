import fs from "fs";

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js"
];

const collections = [
    "drawGroups",
    "drawParticipants",
    "drawBoxes"
];

console.log("===============================================");
console.log("RC357 CONTRIBUTION-DRAW DOCUMENT SCHEMA / OWNERSHIP AUDIT");
console.log("===============================================");

for (const target of targets) {

    console.log("");
    console.log("===============================================");
    console.log(`TARGET: ${target}`);
    console.log("===============================================");

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const lines = fs.readFileSync(target, "utf8").split("\n");

    console.log(`STATUS: FOUND`);
    console.log(`LINES: ${lines.length}`);

    console.log("");
    console.log("----- EXPORTED FUNCTIONS -----");

    lines.forEach((line, index) => {
        if (/export\s+(async\s+)?function\s+/.test(line)) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });

    console.log("");
    console.log("----- OBJECT WRITE CONTEXTS -----");

    lines.forEach((line, index) => {

        if (
            /addDoc\s*\(/.test(line) ||
            /updateDoc\s*\(/.test(line)
        ) {

            const start = Math.max(0, index - 12);
            const end = Math.min(lines.length, index + 28);

            console.log("");
            console.log(
                `--- WRITE CONTEXT AROUND LINE ${index + 1} ---`
            );

            for (let i = start; i < end; i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
        }
    });

    console.log("");
    console.log("----- OWNERSHIP / AUTHORIZATION FIELD REFERENCES -----");

    const ownershipSignals = [
        "groupId",
        "memberId",
        "cooperativeId",
        "userId",
        "adminId",
        "administratorId",
        "createdBy",
        "createdByUserId",
        "ownerId",
        "participantId",
        "boxId",
        "month",
        "year",
        "status",
        "revealed",
        "reserved",
        "reservedBy",
        "reservedAt",
        "assigned",
        "assignedTo"
    ];

    for (const signal of ownershipSignals) {

        const found = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) =>
                new RegExp(`\\b${signal}\\b`, "i").test(line)
            );

        if (found.length > 0) {

            console.log("");
            console.log(
                `${signal}: ${found.length} occurrence(s)`
            );

            for (const item of found) {
                console.log(
                    `  ${item.index + 1}: ${item.line.trim()}`
                );
            }
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC357 FIRESTORE RULE CONTEXT");
console.log("===============================================");

if (!fs.existsSync("firestore.rules")) {
    console.log("firestore.rules: NOT FOUND");
    process.exit(1);
}

const rules = fs.readFileSync(
    "firestore.rules",
    "utf8"
);

const ruleLines = rules.split("\n");

console.log("");
console.log("----- EXISTING ROLE FUNCTIONS -----");

ruleLines.forEach((line, index) => {

    if (
        /function\s+(isSuperAdmin|isCooperativeAdmin|isMember|isMemberOfCooperative|belongsToCooperative)\s*\(/.test(line)
    ) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log("");
console.log("----- EXISTING OWNERSHIP RULE SIGNALS -----");

ruleLines.forEach((line, index) => {

    if (
        /memberId|cooperativeId|request\.auth|resource\.data|request\.resource\.data|isSuperAdmin|isCooperativeAdmin|isMember/.test(line)
    ) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log("");
console.log("----- DRAW COLLECTION RULE STATUS -----");

for (const collection of collections) {

    const explicitRule = ruleLines.some(line =>
        line.includes(`/${collection}/`) ||
        line.includes(`match /${collection}`)
    );

    console.log(
        `${collection}: ${
            explicitRule
                ? "EXPLICIT RULE BLOCK PRESENT"
                : "NO EXPLICIT RULE BLOCK"
        }`
    );
}

console.log("");
console.log("===============================================");
console.log("RC357 DECISION");
console.log("===============================================");

console.log(
    "RC357 FINDING: DRAW WRITE PAYLOADS AND OWNERSHIP FIELDS MUST BE VERIFIED BEFORE DEFINING CREATE/UPDATE AUTHORIZATION CONDITIONS."
);

console.log(
    "RC357 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC357 NEXT DECISION: USE THE VERIFIED DOCUMENT FIELDS TO CONSTRUCT THE MINIMUM-PERMISSION DRAW RULE MATRIX."
);

console.log("");
console.log("===============================================");
console.log("RC357 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC357: NO FILES MODIFIED");
