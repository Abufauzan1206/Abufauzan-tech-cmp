import fs from "fs";

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js",
    "js/firebase-config.js",
    "firebase-config.js"
];

console.log("===============================================");
console.log("RC352 CONTRIBUTION-DRAW FIRESTORE REFERENCE RESOLUTION AUDIT");
console.log("===============================================");

const identifiers = new Set();

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

    console.log("STATUS: FOUND");
    console.log(`LINES: ${lines.length}`);

    console.log("");
    console.log("----- IMPORTS -----");

    lines.forEach((line, index) => {
        if (/^\s*import\s/.test(line)) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });

    console.log("");
    console.log("----- FIRESTORE REFERENCES -----");

    lines.forEach((line, index) => {

        if (
            /collection\s*\(/.test(line) ||
            /doc\s*\(/.test(line) ||
            /getDocs\s*\(/.test(line) ||
            /getDoc\s*\(/.test(line) ||
            /addDoc\s*\(/.test(line) ||
            /updateDoc\s*\(/.test(line)
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }

        /*
         * Capture identifiers used as Firestore path arguments.
         */
        const collectionMatch = line.match(
            /collection\s*\(\s*([^)]+)\)/
        );

        if (collectionMatch) {
            identifiers.add(
                collectionMatch[1].trim()
            );
        }

        const docMatch = line.match(
            /doc\s*\(\s*([^)]+)\)/
        );

        if (docMatch) {
            identifiers.add(
                docMatch[1].trim()
            );
        }
    });

    console.log("");
    console.log("----- RELEVANT CONSTANT / VARIABLE DEFINITIONS -----");

    for (const identifier of identifiers) {

        if (
            /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(identifier)
        ) {

            lines.forEach((line, index) => {

                if (
                    new RegExp(
                        `\\b(const|let|var)\\s+${identifier}\\b`
                    ).test(line)
                ) {
                    console.log(
                        `${index + 1}: ${line.trim()}`
                    );
                }
            });
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC352 IMPORTED MODULE RESOLUTION");
console.log("===============================================");

const importTargets = new Set();

for (const target of targets) {

    if (!fs.existsSync(target)) {
        continue;
    }

    const content = fs.readFileSync(target, "utf8");

    for (const match of content.matchAll(
        /from\s+["']([^"']+)["']/g
    )) {
        importTargets.add(match[1]);
    }
}

for (const imported of importTargets) {

    console.log(`IMPORT: ${imported}`);

    if (
        imported.startsWith(".") &&
        !imported.includes("firebase")
    ) {

        const baseCandidates = [
            imported,
            `${imported}.js`,
            `${imported}/index.js`
        ];

        for (const candidate of baseCandidates) {

            console.log(
                `  RESOLUTION-CANDIDATE: ${candidate}`
            );
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC352 FIRESTORE RULE TARGETS");
console.log("===============================================");

if (fs.existsSync("firestore.rules")) {

    const rules = fs.readFileSync(
        "firestore.rules",
        "utf8"
    );

    rules.split("\n").forEach((line, index) => {

        if (/match\s+\//.test(line)) {
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
console.log("RC352 DECISION");
console.log("===============================================");

console.log(
    "RC352 FINDING: RESOLVE IMPORTED FIRESTORE REFERENCES AND IDENTIFIERS BEFORE RULE CORRELATION."
);

console.log(
    "RC352 STATUS: NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC352 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC352: NO FILES MODIFIED");
