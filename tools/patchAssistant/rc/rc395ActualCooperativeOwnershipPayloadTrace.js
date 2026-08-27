
import fs from "node:fs";

const files = [
    "modules/contribution-draw/group-create/script.js",
    "js/services/drawGroupService.js",
    "js/repositories/baseRepository.js",
    "js/repositories/memberRepository.js",
    "js/repositories/contributionRepository.js",
    "js/cooperative-admin.js"
];

console.log("===============================================");
console.log("RC395 ACTUAL COOPERATIVE OWNERSHIP PAYLOAD TRACE");
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
        /const groupData/i,
        /let groupData/i,
        /groupData\s*=/i,
        /createDrawGroup/i,
        /cooperativeId/i,
        /user\.uid/i,
        /auth\.currentUser/i,
        /users/i,
        /getDoc/i,
        /repository\.create/i,
        /memberRepository/i,
        /contributionRepository/i,
        /create\(/i,
        /findAll/i,
        /findById/i,
        /collection/i,
        /drawGroups/i
    ];

    const printed = new Set();

    lines.forEach((line, index) => {

        if (!patterns.some(pattern => pattern.test(line))) {
            return;
        }

        const start = Math.max(0, index - 6);
        const end = Math.min(lines.length, index + 9);
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
console.log("RC395 DECISION CHECKS");
console.log("===============================================");

console.log("");
console.log("1. EXACT PAYLOAD:");
console.log("   What exact object is passed to createDrawGroup()?");
console.log("");

console.log("2. COOPERATIVE ID:");
console.log("   Is cooperativeId actually present in that object?");
console.log("");

console.log("3. SOURCE:");
console.log("   If cooperativeId exists, where exactly does it come from?");
console.log("");

console.log("4. CLIENT OVERRIDE:");
console.log("   Can the group-create page supply an arbitrary cooperativeId?");
console.log("");

console.log("5. SERVICE:");
console.log("   Does drawGroupService validate or merely persist the supplied object?");
console.log("");

console.log("6. READ ISOLATION:");
console.log("   Can getDrawGroups() return groups belonging to other cooperatives?");
console.log("");

console.log("7. SINGLE-GROUP ISOLATION:");
console.log("   Can getDrawGroupById() retrieve another cooperative's group?");
console.log("");

console.log("8. REPOSITORY BOUNDARY:");
console.log("   Do BaseRepository / MemberRepository / ContributionRepository enforce cooperative ownership?");
console.log("");

console.log("9. DUPLICATE OWNERSHIP:");
console.log("   Confirm no ownerId, createdByUserId, adminId, or equivalent duplicate field is needed.");

console.log("");
console.log("RC395 STATUS: AUDIT ONLY — NO APPLICATION FILES MODIFIED.");

console.log("===============================================");
console.log("RC395 AUDIT COMPLETE");
console.log("===============================================");
