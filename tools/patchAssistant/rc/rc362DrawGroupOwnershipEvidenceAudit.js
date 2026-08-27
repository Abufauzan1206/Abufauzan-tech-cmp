import fs from "fs";

const files = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawReservationService.js",
    "js/services/memberService.js",
    "js/services/authenticatedMemberService.js",
    "js/repositories/memberRepository.js",
    "firestore.rules"
];

console.log("===============================================");
console.log("RC362 DRAW GROUP OWNERSHIP EVIDENCE AUDIT");
console.log("===============================================");

const patterns = [
    /collection\s*\(/,
    /doc\s*\(/,
    /addDoc\s*\(/,
    /setDoc\s*\(/,
    /updateDoc\s*\(/,
    /getDoc\s*\(/,
    /where\s*\(/,
    /\bgroupId\b/,
    /\bcooperativeId\b/,
    /\bmemberId\b/
];

for (const file of files) {
    console.log("");
    console.log(`===== ${file} =====`);

    if (!fs.existsSync(file)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const lines = fs.readFileSync(file, "utf8").split("\n");

    let matches = 0;

    lines.forEach((line, index) => {
        if (patterns.some(pattern => pattern.test(line))) {
            matches++;

            const start = Math.max(0, index - 2);
            const end = Math.min(lines.length, index + 3);

            console.log("");
            console.log(`CONTEXT @ LINE ${index + 1}`);

            for (let i = start; i < end; i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
        }
    });

    console.log("");
    console.log(`TOTAL MATCHED CONTEXTS: ${matches}`);
}

console.log("");
console.log("===============================================");
console.log("RC362 GROUP OWNERSHIP DECISION MATRIX");
console.log("===============================================");

console.log("");
console.log("drawGroups:");
console.log("  REQUIRED: authoritative cooperative ownership source");

console.log("");
console.log("drawParticipants:");
console.log("  REQUIRED: group ownership + member identity");

console.log("");
console.log("drawBoxes:");
console.log("  REQUIRED: group ownership");

console.log("");
console.log("drawReservations:");
console.log("  REQUIRED: group ownership");

console.log("");
console.log("===============================================");
console.log("RC362 DECISION");
console.log("===============================================");

console.log(
    "RC362 FINDING: ONLY AUTHORITATIVE APPLICATION DATA REFERENCES MAY BE USED TO RESOLVE DRAW COOPERATIVE OWNERSHIP."
);

console.log(
    "RC362 SECURITY REQUIREMENT: DO NOT CREATE OR ASSUME A NEW OWNERSHIP FIELD UNTIL EXISTING GROUP DOCUMENT STORAGE AND RELATIONSHIPS HAVE BEEN EXHAUSTED."
);

console.log(
    "RC362 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC362 NEXT DECISION: CLASSIFY THE ACTUAL GROUP DOCUMENT SCHEMA AND SELECT THE SMALLEST SERVER-SIDE OWNERSHIP RESOLUTION PATH."
);

console.log("");
console.log("===============================================");
console.log("RC362 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC362: NO FILES MODIFIED");
