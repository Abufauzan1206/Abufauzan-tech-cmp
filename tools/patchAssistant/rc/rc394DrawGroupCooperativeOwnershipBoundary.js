
import fs from "node:fs";

const files = [
    "js/cooperative-admin.js",
    "modules/contribution-draw/group-create/script.js",
    "js/services/drawGroupService.js",
    "js/services/memberService.js",
    "js/services/contributionService.js",
    "js/repositories/memberRepository.js",
    "js/repositories/contributionRepository.js",
    "js/repositories/baseRepository.js"
];

console.log("===============================================");
console.log("RC394 DRAW GROUP COOPERATIVE OWNERSHIP BOUNDARY");
console.log("===============================================");

for (const path of files) {

    if (!fs.existsSync(path)) {
        console.log("");
        console.log("MISSING:", path);
        continue;
    }

    const text = fs.readFileSync(path, "utf8");
    const lines = text.split("\n");

    console.log("");
    console.log("===============================================");
    console.log("FILE:", path);
    console.log("===============================================");

    const patterns = [
        /cooperativeId/i,
        /groupData/i,
        /createDrawGroup/i,
        /addDoc/i,
        /setDoc/i,
        /updateDoc/i,
        /drawGroups/i,
        /collection/i,
        /repository/i,
        /createMember/i,
        /createContribution/i,
        /auth\.currentUser/i,
        /users/i,
        /getDoc/i
    ];

    const printed = new Set();

    lines.forEach((line, index) => {

        if (!patterns.some(pattern => pattern.test(line))) {
            return;
        }

        const start = Math.max(0, index - 5);
        const end = Math.min(lines.length, index + 8);
        const key = start + ":" + end;

        if (printed.has(key)) {
            return;
        }

        printed.add(key);

        console.log("");
        console.log("--- context around line " + (index + 1) + " ---");

        for (let i = start; i < end; i++) {
            console.log((i + 1) + ": " + lines[i]);
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC394 DECISION CHECKS");
console.log("===============================================");

console.log("");
console.log("1. AUTHORITATIVE COOPERATIVE:");
console.log("   Is cooperativeId obtained from users/{authenticatedUid}?");
console.log("");

console.log("2. CREATE DRAW GROUP PAYLOAD:");
console.log("   Does groupData contain cooperativeId before createDrawGroup()?");
console.log("");

console.log("3. DRAW GROUP SERVICE:");
console.log("   Does createDrawGroup() write cooperativeId into drawGroups?");
console.log("");

console.log("4. CLIENT CONTROL:");
console.log("   Can Cooperative Admin directly choose or submit cooperativeId?");
console.log("");

console.log("5. OWNERSHIP SOURCE:");
console.log("   Is cooperative ownership derived from the authoritative user profile?");
console.log("");

console.log("6. CROSS-COOPERATIVE RISK:");
console.log("   Could a Cooperative Admin create/read another cooperative's draw group?");
console.log("");

console.log("7. DUPLICATE OWNERSHIP:");
console.log("   Confirm no ownerId, createdByUserId, adminId, or equivalent duplicate ownership field is required.");
console.log("");

console.log("8. MEMBER / CONTRIBUTION FOLLOW-THROUGH:");
console.log("   Identify whether downstream member/contribution records can inherit the same cooperative boundary.");
console.log("");

console.log("RC394 STATUS: AUDIT ONLY — NO APPLICATION FILES MODIFIED.");

console.log("===============================================");
console.log("RC394 AUDIT COMPLETE");
console.log("===============================================");
