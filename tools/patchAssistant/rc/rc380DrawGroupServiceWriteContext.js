import fs from "fs";

console.log("===============================================");
console.log("RC380 DRAW GROUP SERVICE WRITE CONTEXT");
console.log("===============================================");

const file = "js/services/drawGroupService.js";

if (!fs.existsSync(file)) {
    console.log("MISSING:", file);
    process.exit(1);
}

const lines = fs.readFileSync(file, "utf8").split("\n");

const targets = [74, 116];

for (const target of targets) {
    console.log("");
    console.log("===============================================");
    console.log(`CONTEXT AROUND LINE ${target + 1}`);
    console.log("===============================================");

    const start = Math.max(0, target - 20);
    const end = Math.min(lines.length, target + 25);

    for (let i = start; i < end; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
}

console.log("");
console.log("===============================================");
console.log("RC380 OWNERSHIP FIELD AUDIT");
console.log("===============================================");

const ownershipPatterns = [
    /\bcooperativeId\b/,
    /\bgroupId\b/,
    /\bmemberId\b/,
    /\badminId\b/,
    /\buid\b/,
    /\bownerId\b/,
    /\bcreatedByUserId\b/,
    /\bcreatedBy\b/,
    /auth\.currentUser/,
    /request\.auth/,
    /users/
];

lines.forEach((line, index) => {
    if (ownershipPatterns.some(pattern => pattern.test(line))) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log("");
console.log("===============================================");
console.log("RC380 DECISION");
console.log("===============================================");
console.log(
    "IDENTIFY THE EXACT drawGroups CREATION WRITE BEFORE PATCHING."
);
console.log(
    "REUSE AN EXISTING AUTHORITATIVE cooperativeId SOURCE IF PRESENT."
);
console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);
console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);
console.log(
    "RC380 STATUS: AUDIT ONLY — NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC380 AUDIT COMPLETE");
console.log("===============================================");
