import fs from "fs";

const file = "js/services/drawParticipantService.js";
const content = fs.readFileSync(file, "utf8");

console.log("===============================================");
console.log("RC330 DRAW PARTICIPANT TRUST BOUNDARY AUDIT");
console.log("===============================================");

console.log("");
console.log("----- EXPORTED FUNCTIONS -----");

const functions = [
    ...content.matchAll(
        /export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/g
    )
].map(match => match[1]);

console.log(
    functions.length
        ? functions.join("\n")
        : "NONE"
);

console.log("");
console.log("----- AUTHENTICATION -----");

console.log(
    /auth\.currentUser/.test(content)
        ? "AUTH CURRENT USER: PRESENT"
        : "AUTH CURRENT USER: ABSENT"
);

console.log("");
console.log("----- OWNERSHIP FIELDS -----");

for (const field of ["memberId", "cooperativeId"]) {
    console.log(
        `${field}: ${
            new RegExp(`\\b${field}\\b`).test(content)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- WRITE OPERATIONS -----");

const writes = [
    ...content.matchAll(
        /\b(addDoc|setDoc|updateDoc|deleteDoc)\s*\(/g
    )
].map(match => match[1]);

console.log(
    writes.length
        ? writes.join(", ")
        : "NONE"
);

console.log("");
console.log("----- PARTICIPANT WRITE CONTEXT -----");

const addParticipantMatch = content.match(
    /export\s+(?:async\s+)?function\s+addParticipantToGroup[\s\S]*?(?=\nexport\s|\s*$)/
);

if (addParticipantMatch) {
    console.log(addParticipantMatch[0]);
} else {
    console.log("addParticipantToGroup function not found.");
}

console.log("");
console.log("----- RC330 DECISION -----");

const hasWrite = writes.length > 0;
const hasMemberId = /\bmemberId\b/.test(content);
const hasAuth = /auth\.currentUser/.test(content);

if (hasWrite && hasMemberId && !hasAuth) {
    console.log(
        "RC330 FINDING: MEMBER-OWNERSHIP WRITE WITHOUT AUTHENTICATED-USER TRUST BOUNDARY."
    );
    console.log(
        "RC330 STATUS: REVIEW REQUIRED"
    );
} else {
    console.log(
        "RC330 STATUS: NO IMMEDIATE TRUST-BOUNDARY GAP DETECTED."
    );
}

console.log("");
console.log("===============================================");
console.log("RC330 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC330: NO FILES MODIFIED");
