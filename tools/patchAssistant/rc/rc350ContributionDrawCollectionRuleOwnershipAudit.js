import fs from "fs";

const services = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js"
];

const rulesFile = "firestore.rules";

console.log("===============================================");
console.log("RC350 CONTRIBUTION-DRAW COLLECTION/RULE OWNERSHIP AUDIT");
console.log("===============================================");

console.log("");
console.log("----- DRAW SERVICE FIRESTORE COLLECTIONS -----");

const collectionNames = new Set();

for (const target of services) {
    console.log("");
    console.log(`===== ${target} =====`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const content = fs.readFileSync(target, "utf8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
        if (/collection\s*\(|doc\s*\(/.test(line)) {
            console.log(`${index + 1}: ${line.trim()}`);
        }

        const matches = line.match(
            /collection\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g
        );

        if (matches) {
            for (const match of matches) {
                const value = match.match(
                    /collection\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/
                );

                if (value) {
                    collectionNames.add(value[1]);
                }
            }
        }
    });
}

console.log("");
console.log("----- LITERAL COLLECTION NAMES DISCOVERED -----");

if (collectionNames.size === 0) {
    console.log("NO LITERAL COLLECTION NAMES FOUND");
} else {
    for (const name of collectionNames) {
        console.log(`COLLECTION: ${name}`);
    }
}

console.log("");
console.log("----- FIRESTORE RULE COLLECTION STRUCTURE -----");

if (!fs.existsSync(rulesFile)) {
    console.log("FIRESTORE RULES: NOT FOUND");
    process.exit(1);
}

const rules = fs.readFileSync(rulesFile, "utf8");
const ruleLines = rules.split("\n");

let currentMatch = null;
let braceDepth = 0;

ruleLines.forEach((line, index) => {
    const match = line.match(
        /^\s*match\s+\/databases\/\{database\}\/documents\/(.+)/
    );

    if (match) {
        currentMatch = match[1].trim();
        braceDepth = 0;
        console.log("");
        console.log(
            `RULE TARGET ${index + 1}: ${currentMatch}`
        );
        return;
    }

    if (currentMatch !== null) {
        if (line.includes("{")) {
            braceDepth += (line.match(/{/g) || []).length;
        }

        if (line.includes("}")) {
            braceDepth -= (line.match(/}/g) || []).length;
        }

        if (
            /allow\s+(read|write|create|update|delete)/.test(line) ||
            /request\.auth|userProfile|isMember|isSuperAdmin|isCooperativeAdmin|memberId|cooperativeId/.test(line)
        ) {
            console.log(
                `  ${index + 1}: ${line.trim()}`
            );
        }

        if (braceDepth < 0) {
            currentMatch = null;
        }
    }
});

console.log("");
console.log("----- FULL RULE FILE -----");

ruleLines.forEach((line, index) => {
    console.log(`${index + 1}: ${line}`);
});

console.log("");
console.log("===============================================");
console.log("RC350 DECISION");
console.log("===============================================");

console.log(
    `LITERAL DRAW COLLECTIONS DISCOVERED: ${collectionNames.size}`
);

console.log(
    "RC350 FINDING: DRAW SERVICE COLLECTION PATHS MUST BE CORRELATED WITH THEIR FIRESTORE RULE MATCH BLOCKS."
);

console.log(
    "RC350 STATUS: NO AUTHORIZATION PATCH UNTIL COLLECTION OWNERSHIP AND ROLE PERMISSIONS ARE CONFIRMED."
);

console.log("");
console.log("===============================================");
console.log("RC350 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC350: NO FILES MODIFIED");
