import fs from "fs";

const services = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js"
];

const rulesFile = "firestore.rules";

console.log("===============================================");
console.log("RC351 CONTRIBUTION-DRAW DYNAMIC COLLECTION TRACE AUDIT");
console.log("===============================================");

const discoveredPaths = new Set();

for (const target of services) {

    console.log("");
    console.log("===============================================");
    console.log(`TARGET: ${target}`);
    console.log("===============================================");

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const content = fs.readFileSync(target, "utf8");
    const lines = content.split("\n");

    console.log(`STATUS: FOUND`);
    console.log(`LINES: ${lines.length}`);

    console.log("");
    console.log("----- COLLECTION / DOCUMENT EXPRESSIONS -----");

    lines.forEach((line, index) => {

        if (
            /collection\s*\(/.test(line) ||
            /doc\s*\(/.test(line)
        ) {
            console.log(
                `${index + 1}: ${line.trim()}`
            );
        }

        /*
         * Capture common dynamic Firestore path patterns:
         *
         * collection("name")
         * collection(variable)
         * collection(`name/${id}`)
         * collection(`groups/${groupId}/participants`)
         * doc(...)
         */

        const templateMatches = [
            ...line.matchAll(
                /collection\s*\(\s*`([^`]+)`\s*\)/g
            )
        ];

        for (const match of templateMatches) {
            discoveredPaths.add(match[1]);
        }

        const stringMatches = [
            ...line.matchAll(
                /collection\s*\(\s*["']([^"']+)["']\s*\)/g
            )
        ];

        for (const match of stringMatches) {
            discoveredPaths.add(match[1]);
        }

        /*
         * Capture template fragments appearing around
         * collection/document references.
         */
        if (/collection\s*\(/.test(line)) {

            const trimmed = line.trim();

            console.log(
                `  RC351 PATH-CANDIDATE: ${trimmed}`
            );
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC351 RULE FILE ANALYSIS");
console.log("===============================================");

if (!fs.existsSync(rulesFile)) {
    console.log("FIRESTORE RULES: NOT FOUND");
    process.exit(1);
}

const rules = fs.readFileSync(rulesFile, "utf8");
const ruleLines = rules.split("\n");

console.log(`RULE FILE: ${rulesFile}`);
console.log(`LINES: ${ruleLines.length}`);

console.log("");
console.log("----- ALL FIRESTORE MATCH BLOCKS -----");

ruleLines.forEach((line, index) => {

    if (/^\s*match\s+\//.test(line)) {
        console.log(
            `${index + 1}: ${line.trim()}`
        );
    }
});

console.log("");
console.log("----- DRAW-RELATED RULE SIGNALS -----");

ruleLines.forEach((line, index) => {

    if (
        /draw|group|participant|box|reservation|month|memberId|cooperativeId/i.test(line)
    ) {
        console.log(
            `${index + 1}: ${line.trim()}`
        );
    }
});

console.log("");
console.log("----- DISCOVERED LITERAL / TEMPLATE COLLECTION PATHS -----");

if (discoveredPaths.size === 0) {

    console.log(
        "NO LITERAL COLLECTION PATHS EXTRACTED."
    );

} else {

    for (const path of discoveredPaths) {

        console.log(
            `PATH: ${path}`
        );
    }
}

console.log("");
console.log("===============================================");
console.log("RC351 DECISION");
console.log("===============================================");

console.log(
    `DRAW SERVICE FILES ANALYZED: ${services.filter(fs.existsSync).length}/${services.length}`
);

console.log(
    `COLLECTION PATH CANDIDATES: ${discoveredPaths.size}`
);

console.log(
    "RC351 FINDING: DYNAMIC DRAW COLLECTION PATHS MUST BE CORRELATED WITH FIRESTORE MATCH BLOCKS."
);

console.log(
    "RC351 STATUS: NO FILES MODIFIED. NO AUTHORIZATION PATCH APPLIED."
);

console.log("");
console.log("===============================================");
console.log("RC351 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC351: NO FILES MODIFIED");
