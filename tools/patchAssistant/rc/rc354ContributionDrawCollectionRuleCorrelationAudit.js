import fs from "fs";

const collections = [
    "drawGroups",
    "drawParticipants",
    "drawBoxes"
];

const services = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js"
];

console.log("===============================================");
console.log("RC354 CONTRIBUTION-DRAW COLLECTION/RULE CORRELATION AUDIT");
console.log("===============================================");

console.log("");
console.log("----- DRAW COLLECTIONS -----");

for (const collection of collections) {
    console.log(`COLLECTION: ${collection}`);
}

console.log("");
console.log("----- SERVICE OWNERSHIP -----");

for (const target of services) {

    if (!fs.existsSync(target)) {
        console.log(`NOT FOUND: ${target}`);
        continue;
    }

    const content = fs.readFileSync(target, "utf8");

    console.log("");
    console.log(`SERVICE: ${target}`);

    for (const collection of collections) {

        const matches = [];

        content.split("\n").forEach((line, index) => {
            if (line.includes(`"${collection}"`)) {
                matches.push({
                    line: index + 1,
                    text: line.trim()
                });
            }
        });

        if (matches.length) {
            console.log(
                `  ${collection}: ${matches.length} reference(s)`
            );

            for (const match of matches) {
                console.log(
                    `    ${match.line}: ${match.text}`
                );
            }
        }
    }
}

console.log("");
console.log("===============================================");
console.log("FIRESTORE RULE CORRELATION");
console.log("===============================================");

if (!fs.existsSync("firestore.rules")) {
    console.log("FIRESTORE RULES: NOT FOUND");
    process.exit(1);
}

const rules = fs.readFileSync(
    "firestore.rules",
    "utf8"
);

const lines = rules.split("\n");

for (const collection of collections) {

    console.log("");
    console.log("-----------------------------------------------");
    console.log(`RULE SEARCH: ${collection}`);
    console.log("-----------------------------------------------");

    let found = false;

    lines.forEach((line, index) => {

        if (
            line.includes(collection) ||
            line.includes(`/${collection}/`)
        ) {
            found = true;

            const start = Math.max(0, index - 3);
            const end = Math.min(
                lines.length,
                index + 8
            );

            console.log(
                `MATCH AT LINE ${index + 1}`
            );

            for (let i = start; i < end; i++) {
                console.log(
                    `${i + 1}: ${lines[i]}`
                );
            }
        }
    });

    if (!found) {
        console.log(
            `NO EXPLICIT RULE MATCH FOUND FOR ${collection}`
        );
    }
}

console.log("");
console.log("===============================================");
console.log("ALL FIRESTORE MATCH BLOCKS");
console.log("===============================================");

lines.forEach((line, index) => {

    if (/^\s*match\s+\//.test(line)) {
        console.log(
            `${index + 1}: ${line.trim()}`
        );
    }
});

console.log("");
console.log("===============================================");
console.log("RC354 DECISION");
console.log("===============================================");

const rulesText = rules;

for (const collection of collections) {

    const present = rulesText.includes(collection);

    console.log(
        `${collection}: ${
            present
                ? "RULE SURFACE PRESENT"
                : "RULE SURFACE NOT EXPLICITLY FOUND"
        }`
    );
}

console.log("");
console.log(
    "RC354 FINDING: EACH DIRECT DRAW SERVICE COLLECTION MUST HAVE AN EXPLICITLY VERIFIED FIRESTORE RULE OWNERSHIP MODEL."
);

console.log(
    "RC354 STATUS: NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC354 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC354: NO FILES MODIFIED");
