import fs from "fs";

const rulesFile = "firestore.rules";

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawReservationService.js",
    "js/services/drawPreparationService.js"
];

console.log("===============================================");
console.log("RC360 CONTRIBUTION-DRAW OWNERSHIP RESOLUTION AUDIT");
console.log("===============================================");

console.log("");
console.log("----- DRAW DOCUMENT OWNERSHIP FIELDS -----");

const ownershipFields = [
    "cooperativeId",
    "groupId",
    "memberId",
    "participantId",
    "adminId",
    "createdBy",
    "userId",
    "ownerId"
];

for (const target of targets) {
    console.log("");
    console.log(`===== ${target} =====`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const lines = fs.readFileSync(target, "utf8").split("\n");

    for (const field of ownershipFields) {
        const found = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) =>
                new RegExp(`\\b${field}\\b`, "i").test(line)
            );

        if (found.length > 0) {
            console.log("");
            console.log(`${field}: ${found.length} occurrence(s)`);

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
console.log("----- COOPERATIVE OWNERSHIP SOURCES -----");
console.log("===============================================");

const ownershipSources = [
    "js/services/memberService.js",
    "js/services/authenticatedMemberService.js",
    "js/services/loanService.js",
    "js/services/welfareService.js",
    "js/repositories/memberRepository.js"
];

for (const target of ownershipSources) {
    console.log("");
    console.log(`===== ${target} =====`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const lines = fs.readFileSync(target, "utf8").split("\n");

    lines.forEach((line, index) => {
        if (
            /cooperativeId|memberId|userProfile|profile\.cooperativeId|belongsToCooperative|isMemberOfCooperative/.test(
                line
            )
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("");
console.log("===============================================");
console.log("----- FIRESTORE OWNERSHIP FUNCTIONS -----");
console.log("===============================================");

if (!fs.existsSync(rulesFile)) {
    console.log("firestore.rules: NOT FOUND");
    process.exit(1);
}

const rules = fs.readFileSync(rulesFile, "utf8");
const ruleLines = rules.split("\n");

const ownershipSignals = [
    "function userProfile",
    "function isSuperAdmin",
    "function isCooperativeAdmin",
    "function isMember",
    "function isMemberOfCooperative",
    "function belongsToCooperative",
    "cooperativeId",
    "memberId"
];

for (const signal of ownershipSignals) {
    console.log("");
    console.log(`SIGNAL: ${signal}`);

    ruleLines.forEach((line, index) => {
        if (line.includes(signal)) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("");
console.log("===============================================");
console.log("----- DRAW → COOPERATIVE RESOLUTION TEST -----");
console.log("===============================================");

const drawOwnership = {
    drawGroups:
        "Does drawGroups contain cooperativeId directly, or can its cooperative be resolved authoritatively?",
    drawParticipants:
        "Can drawParticipants resolve cooperative ownership through groupId/memberId?",
    drawBoxes:
        "Can drawBoxes resolve cooperative ownership through groupId?",
    drawReservations:
        "Can reservations resolve cooperative ownership through groupId?"
};

for (const [collection, question] of Object.entries(drawOwnership)) {
    console.log("");
    console.log(`COLLECTION: ${collection}`);
    console.log(`QUESTION: ${question}`);
}

console.log("");
console.log("===============================================");
console.log("RC360 DECISION");
console.log("===============================================");

console.log(
    "RC360 FINDING: DETERMINE THE AUTHORITATIVE COOPERATIVE OWNERSHIP PATH BEFORE ADDING REDUNDANT cooperativeId FIELDS TO DRAW DOCUMENTS."
);

console.log(
    "RC360 SECURITY REQUIREMENT: DRAW ACCESS MUST NOT BE GRANTED ACROSS COOPERATIVES THROUGH groupId, memberId, participantId, OR ADMIN IDENTIFIERS WITHOUT AN AUTHORITATIVE OWNERSHIP RELATIONSHIP."
);

console.log(
    "RC360 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC360 NEXT DECISION: IF AN EXISTING AUTHORITATIVE OWNERSHIP PATH EXISTS, REUSE IT; OTHERWISE DEFINE THE SMALLEST REQUIRED OWNERSHIP-LAYER PATCH."
);

console.log("");
console.log("===============================================");
console.log("RC360 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC360: NO FILES MODIFIED");
