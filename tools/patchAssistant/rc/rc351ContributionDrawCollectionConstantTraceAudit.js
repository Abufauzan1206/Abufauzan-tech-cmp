import fs from "fs";

const services = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js"
];

console.log("===============================================");
console.log("RC351 CONTRIBUTION-DRAW COLLECTION CONSTANT TRACE AUDIT");
console.log("===============================================");

const imports = new Set();
const identifiers = new Set();

for (const target of services) {

    console.log("");
    console.log(`===== SERVICE: ${target} =====`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const content = fs.readFileSync(target, "utf8");
    const lines = content.split("\n");

    console.log(`STATUS: FOUND`);
    console.log(`LINES: ${lines.length}`);

    console.log("");
    console.log("----- IMPORTS -----");

    lines.forEach((line, index) => {
        if (/^\s*import\s/.test(line)) {
            console.log(`${index + 1}: ${line.trim()}`);

            const fromMatch = line.match(
                /from\s+["']([^"']+)["']/
            );

            if (fromMatch) {
                imports.add(fromMatch[1]);
            }
        }
    });

    console.log("");
    console.log("----- COLLECTION / REPOSITORY IDENTIFIERS -----");

    lines.forEach((line, index) => {

        if (
            /collectionRef|Collection|COLLECTION|collectionName|collectionPath|path|repository|Repository/.test(
                line
            )
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }

        const variableMatches = line.match(
            /\b[A-Z][A-Z0-9_]{2,}\b/g
        );

        if (variableMatches) {
            for (const value of variableMatches) {
                identifiers.add(value);
            }
        }
    });

    console.log("");
    console.log("----- FIRESTORE CALL CONTEXT -----");

    lines.forEach((line, index) => {
        if (
            /collection\s*\(|doc\s*\(|addDoc|updateDoc|deleteDoc|getDoc|getDocs|where\s*\(/.test(
                line
            )
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC351 IMPORTED MODULES");
console.log("===============================================");

for (const value of imports) {
    console.log(`IMPORT: ${value}`);
}

console.log("");
console.log("===============================================");
console.log("RC351 LIKELY CONSTANT IDENTIFIERS");
console.log("===============================================");

for (const value of identifiers) {
    console.log(`IDENTIFIER: ${value}`);
}

console.log("");
console.log("===============================================");
console.log("RC351 DECISION");
console.log("===============================================");

console.log(
    "RC351 FINDING: DRAW SERVICES USE INDIRECT COLLECTION REFERENCES."
);

console.log(
    "RC351 STATUS: TRACE IMPORTED MODULES / CONSTANTS / REPOSITORIES TO RESOLVE THE ACTUAL DRAW COLLECTION PATHS."
);

console.log(
    "RC351: NO FILES MODIFIED"
);

console.log("===============================================");
console.log("RC351 AUDIT COMPLETE");
console.log("===============================================");
