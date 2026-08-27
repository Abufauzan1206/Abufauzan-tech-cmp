import fs from "fs";

console.log("===============================================");
console.log("RC383 DRAW GROUP DATA FULL CONSTRUCTION");
console.log("===============================================");

const file = "modules/contribution-draw/create-group/script.js";

if (!fs.existsSync(file)) {
    console.log("MISSING:", file);
    process.exit(1);
}

const lines = fs.readFileSync(file, "utf8").split("\n");

console.log("");
console.log("===============================================");
console.log("FULL CREATE-GROUP HANDLER CONTEXT");
console.log("===============================================");

for (let i = 1; i <= lines.length; i++) {
    console.log(`${i}: ${lines[i - 1]}`);
}

console.log("");
console.log("===============================================");
console.log("RC383 OWNERSHIP / ID FIELD AUDIT");
console.log("===============================================");

const patterns = [
    /\bcooperativeId\b/i,
    /\bcooperative\b/i,
    /profile\.cooperativeId/i,
    /auth\.currentUser/i,
    /getAuth/i,
    /\buid\b/i,
    /\bgroupId\b/i,
    /\bmemberId\b/i,
    /\badminId\b/i,
    /\bownerId\b/i,
    /\bcreatedByUserId\b/i,
    /\bcreatedBy\b/i,
    /\bgroupData\b/i,
    /createDrawGroup/i
];

lines.forEach((line, index) => {
    if (patterns.some(pattern => pattern.test(line))) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log("");
console.log("===============================================");
console.log("RC383 DECISION");
console.log("===============================================");

console.log(
    "IDENTIFY WHETHER groupData ALREADY CONTAINS AN AUTHORITATIVE cooperativeId."
);

console.log(
    "IF cooperativeId IS ABSENT, TRACE THE EXISTING USER/COOPERATIVE PROFILE SOURCE."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "RC383 STATUS: AUDIT ONLY — NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC383 AUDIT COMPLETE");
console.log("===============================================");
