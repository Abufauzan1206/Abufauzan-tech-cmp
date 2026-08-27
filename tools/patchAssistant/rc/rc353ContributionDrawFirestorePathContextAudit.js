import fs from "fs";

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js",
    "js/firebase-config.js"
];

console.log("===============================================");
console.log("RC353 CONTRIBUTION-DRAW FIRESTORE PATH CONTEXT AUDIT");
console.log("===============================================");

for (const target of targets) {

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
    console.log("----- FIRESTORE CALL CONTEXT -----");

    const firestoreCall =
        /collection\s*\(|doc\s*\(|addDoc\s*\(|getDocs\s*\(|getDoc\s*\(|updateDoc\s*\(|deleteDoc\s*\(/;

    for (let i = 0; i < lines.length; i++) {

        if (firestoreCall.test(lines[i])) {

            const start = Math.max(0, i - 3);
            const end = Math.min(lines.length, i + 5);

            console.log("");
            console.log(
                `--- CONTEXT AROUND LINE ${i + 1} ---`
            );

            for (let j = start; j < end; j++) {
                console.log(
                    `${j + 1}: ${lines[j]}`
                );
            }
        }
    }

    console.log("");
    console.log("----- IMPORTS -----");

    lines.forEach((line, index) => {
        if (/^\s*import\s/.test(line)) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });

    console.log("");
    console.log("----- POSSIBLE COLLECTION / DOCUMENT IDENTIFIERS -----");

    const identifiers = new Set();

    for (const line of lines) {

        for (const match of line.matchAll(
            /\b(collection|doc)\s*\(\s*([^,\)]+)/g
        )) {
            identifiers.add(match[2].trim());
        }
    }

    if (identifiers.size === 0) {
        console.log("NONE RESOLVED ON SINGLE-LINE SCAN.");
    } else {
        for (const identifier of identifiers) {
            console.log(`IDENTIFIER: ${identifier}`);
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC353 FIRESTORE RULE MATCH BLOCKS");
console.log("===============================================");

if (fs.existsSync("firestore.rules")) {

    const rules = fs.readFileSync(
        "firestore.rules",
        "utf8"
    );

    const lines = rules.split("\n");

    lines.forEach((line, index) => {

        if (/^\s*match\s+\//.test(line)) {
            console.log(
                `${index + 1}: ${line.trim()}`
            );
        }
    });

} else {
    console.log("firestore.rules: NOT FOUND");
}

console.log("");
console.log("===============================================");
console.log("RC353 DECISION");
console.log("===============================================");

console.log(
    "RC353 FINDING: FIRESTORE PATH EXPRESSIONS REQUIRE MULTI-LINE CONTEXT RESOLUTION BEFORE COLLECTION/RULE OWNERSHIP CAN BE CORRELATED."
);

console.log(
    "RC353 STATUS: NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC353 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC353: NO FILES MODIFIED");
