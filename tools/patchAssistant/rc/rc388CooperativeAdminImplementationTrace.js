import fs from "fs";

const file = "js/cooperative-admin.js";

console.log("");
console.log("===============================================");
console.log("RC388 COOPERATIVE ADMIN IMPLEMENTATION TRACE");
console.log("===============================================");

if (!fs.existsSync(file)) {
    console.log("FAIL: js/cooperative-admin.js not found.");
    process.exit(1);
}

const source = fs.readFileSync(file, "utf8");
const lines = source.split("\n");

console.log("");
console.log("===============================================");
console.log("FULL js/cooperative-admin.js");
console.log("===============================================");

lines.forEach((line, index) => {
    console.log(`${index + 1}: ${line}`);
});

console.log("");
console.log("===============================================");
console.log("RC388 TARGETED OWNERSHIP TRACE");
console.log("===============================================");

const patterns = [
    /auth\.currentUser/i,
    /onAuthStateChanged/i,
    /users/i,
    /getDoc\s*\(/i,
    /doc\s*\(/i,
    /user\.uid/i,
    /userData/i,
    /profile/i,
    /cooperativeId/i,
    /cooperative/i,
    /CMPAuth/i,
    /role/i
];

lines.forEach((line, index) => {
    if (
        patterns.some(pattern => pattern.test(line))
    ) {
        console.log(`${index + 1}: ${line}`);
    }
});

console.log("");
console.log("===============================================");
console.log("RC388 DECISION");
console.log("===============================================");

console.log(
    "IDENTIFY THE EXACT PROFILE OBJECT USED BY THE COOPERATIVE ADMIN DASHBOARD."
);

console.log(
    "IDENTIFY WHETHER THAT PROFILE OBJECT CONTAINS cooperativeId."
);

console.log(
    "IDENTIFY WHETHER cooperativeId IS STORED IN AN EXISTING DASHBOARD STATE, VARIABLE, OR PROFILE OBJECT."
);

console.log(
    "TRACE WHETHER THE CREATE-GROUP MODULE CAN REUSE THAT AUTHORITATIVE SOURCE."
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
    "RC388 STATUS: AUDIT ONLY — NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC388 AUDIT COMPLETE");
console.log("===============================================");
