import fs from "fs";

const files = [
    "cooperative-admin.html",
    "js/cooperative-admin.js",
    "js/navigation/sidebar.js",
    "js/components/roleAuthorization.js",
    "js/services/drawGroupService.js",
    "js/services/memberService.js",
    "js/services/contributionService.js"
];

console.log("===============================================");
console.log("RC392 COOPERATIVE ADMIN END-TO-END AUDIT");
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
        /cooperative_admin/i,
        /rolesMatch/i,
        /onAuthStateChanged/i,
        /createDrawGroup/i,
        /getDrawGroups/i,
        /createMember/i,
        /createContribution/i
    ];

    const printed = new Set();

    lines.forEach((line, index) => {

        if (!patterns.some(pattern => pattern.test(line))) {
            return;
        }

        const start = Math.max(0, index - 5);
        const end = Math.min(lines.length, index + 6);
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
console.log("RC392 QUESTIONS");
console.log("===============================================");
console.log("1. Does Cooperative Admin authenticate correctly?");
console.log("2. Is users/{uid} loaded as the authoritative profile?");
console.log("3. Is role verified as cooperative_admin?");
console.log("4. Is cooperativeId obtained from that profile?");
console.log("5. Is the cooperative record reachable through cooperativeId?");
console.log("6. Are Cooperative Admin operations restricted to that cooperative?");
console.log("7. Does Draw Group creation preserve the cooperative boundary?");
console.log("8. Are member/contribution operations similarly bounded?");
console.log("9. Are unauthorized roles redirected or blocked?");
console.log("");
console.log("RC392 STATUS: AUDIT ONLY — NO APPLICATION FILES MODIFIED.");
console.log("===============================================");
console.log("RC392 AUDIT COMPLETE");
console.log("===============================================");
