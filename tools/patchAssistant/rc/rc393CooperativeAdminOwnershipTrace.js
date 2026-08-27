
import fs from "node:fs";

const files = [
    "js/cooperative-admin.js",
    "js/navigation/sidebar.js",
    "js/services/drawGroupService.js",
    "modules/contribution-draw/group-create/script.js",
    "js/services/memberService.js",
    "js/services/contributionService.js",
    "js/repositories/memberRepository.js",
    "js/repositories/contributionRepository.js",
    "js/repositories/baseRepository.js"
];

console.log("===============================================");
console.log("RC393 COOPERATIVE ADMIN OWNERSHIP TRACE");
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

    const terms = [
        "cooperativeId",
        "createDrawGroup",
        "createMember",
        "createContribution",
        "repository.create",
        "memberRepository.create",
        "contributionRepository.create",
        "users",
        "getDoc",
        "auth.currentUser",
        "onAuthStateChanged",
        "memberId",
        "uid"
    ];

    const printed = new Set();

    lines.forEach((line, index) => {
        if (!terms.some(term => line.includes(term))) {
            return;
        }

        const start = Math.max(0, index - 4);
        const end = Math.min(lines.length, index + 7);
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
console.log("RC393 DECISION CHECKS");
console.log("===============================================");

console.log("1. AUTHORITATIVE SOURCE:");
console.log("   Does Cooperative Admin obtain cooperativeId from users/{uid}?");

console.log("");
console.log("2. DRAW GROUP:");
console.log("   Does the actual createDrawGroup() payload contain cooperativeId?");

console.log("");
console.log("3. DRAW GROUP SERVICE:");
console.log("   Does createDrawGroup() preserve cooperativeId when writing drawGroups?");

console.log("");
console.log("4. MEMBER:");
console.log("   Does member creation obtain cooperativeId from an authoritative profile/context?");

console.log("");
console.log("5. CONTRIBUTION:");
console.log("   Does contribution creation preserve cooperativeId?");

console.log("");
console.log("6. REPOSITORY:");
console.log("   Does the repository layer enforce or merely accept cooperativeId?");

console.log("");
console.log("7. ISOLATION:");
console.log("   Is there any path where a Cooperative Admin can supply another cooperativeId directly?");

console.log("");
console.log("8. DUPLICATE OWNERSHIP:");
console.log("   Confirm no ownerId, createdByUserId, or similar duplicate ownership field is introduced.");

console.log("");
console.log("RC393 STATUS: AUDIT ONLY — NO APPLICATION FILES MODIFIED.");

console.log("===============================================");
console.log("RC393 AUDIT COMPLETE");
console.log("===============================================");
