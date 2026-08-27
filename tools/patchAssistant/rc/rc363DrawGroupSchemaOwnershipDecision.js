import fs from "fs";

console.log("===============================================");
console.log("RC363 DRAW GROUP SCHEMA OWNERSHIP DECISION");
console.log("===============================================");

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawReservationService.js",
    "firestore.rules"
];

function showRange(file, start, end) {
    if (!fs.existsSync(file)) {
        console.log(`STATUS: NOT FOUND: ${file}`);
        return;
    }

    const lines = fs.readFileSync(file, "utf8").split("\n");

    for (let i = start - 1; i < Math.min(end, lines.length); i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
}

console.log("");
console.log("----- ACTUAL drawGroups CREATE IMPLEMENTATION -----");
console.log("");

showRange(
    "js/services/drawGroupService.js",
    1,
    145
);

console.log("");
console.log("===============================================");
console.log("----- ACTUAL PARTICIPANT CREATE IMPLEMENTATION -----");
console.log("");

showRange(
    "js/services/drawParticipantService.js",
    1,
    75
);

console.log("");
console.log("===============================================");
console.log("----- ACTUAL FIRESTORE DRAW/RULE CONTEXT -----");
console.log("");

if (fs.existsSync("firestore.rules")) {
    const lines = fs.readFileSync("firestore.rules", "utf8").split("\n");

    lines.forEach((line, index) => {
        if (
            /drawGroups|drawParticipants|drawBoxes|drawReservations|belongsToCooperative|isCooperativeAdmin|isMemberOfCooperative|userProfile/.test(line)
        ) {
            const start = Math.max(0, index - 4);
            const end = Math.min(lines.length, index + 8);

            console.log("");
            console.log(`RULE CONTEXT @ LINE ${index + 1}`);

            for (let i = start; i < end; i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
        }
    });
} else {
    console.log("firestore.rules: NOT FOUND");
}

console.log("");
console.log("===============================================");
console.log("----- OWNERSHIP FIELD CLASSIFICATION -----");
console.log("===============================================");

const ownershipFields = [
    "cooperativeId",
    "groupId",
    "memberId",
    "participantId",
    "adminId",
    "createdBy",
    "createdByUserId",
    "ownerId",
    "userId"
];

for (const field of ownershipFields) {
    console.log("");
    console.log(`FIELD: ${field}`);

    for (const file of targets) {
        if (!fs.existsSync(file)) continue;

        const lines = fs.readFileSync(file, "utf8").split("\n");

        lines.forEach((line, index) => {
            if (new RegExp(`\\b${field}\\b`, "i").test(line)) {
                console.log(
                    `${file}:${index + 1}: ${line.trim()}`
                );
            }
        });
    }
}

console.log("");
console.log("===============================================");
console.log("RC363 DECISION");
console.log("===============================================");

console.log(
    "RC363 FINDING: THE drawGroups CREATE PAYLOAD MUST BE TREATED AS THE PRIMARY OWNERSHIP EVIDENCE SOURCE."
);

console.log(
    "RC363 SECURITY REQUIREMENT: DO NOT AUTHORIZE DRAW CHILD COLLECTIONS UNTIL THE GROUP DOCUMENT PROVIDES, OR CAN AUTHORITATIVELY RESOLVE, THE COOPERATIVE OWNERSHIP REQUIRED BY FIRESTORE RULES."
);

console.log(
    "RC363 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC363 NEXT DECISION: SELECT BETWEEN DIRECT GROUP-LEVEL OWNERSHIP RESOLUTION AND THE SMALLEST REQUIRED OWNERSHIP-LAYER PATCH."
);

console.log("");
console.log("===============================================");
console.log("RC363 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC363: NO FILES MODIFIED");
