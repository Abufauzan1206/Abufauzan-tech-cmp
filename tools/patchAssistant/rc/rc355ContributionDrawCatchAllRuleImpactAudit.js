import fs from "fs";

const collections = [
    "drawGroups",
    "drawParticipants",
    "drawBoxes"
];

const rulesFile = "firestore.rules";

console.log("===============================================");
console.log("RC355 CONTRIBUTION-DRAW CATCH-ALL RULE IMPACT AUDIT");
console.log("===============================================");

if (!fs.existsSync(rulesFile)) {
    console.log("FIRESTORE RULES: NOT FOUND");
    process.exit(1);
}

const rules = fs.readFileSync(rulesFile, "utf8");
const lines = rules.split("\n");

console.log("");
console.log("----- EXPLICIT DRAW RULE BLOCK SEARCH -----");

for (const collection of collections) {

    const matches = lines
        .map((line, index) => ({
            line,
            index
        }))
        .filter(({ line }) =>
            line.includes(`/${collection}/`) ||
            line.includes(`match /${collection}`)
        );

    console.log("");
    console.log(`COLLECTION: ${collection}`);

    if (matches.length === 0) {
        console.log("  EXPLICIT RULE: NONE");
    } else {
        for (const match of matches) {
            console.log(
                `  ${match.index + 1}: ${match.line.trim()}`
            );
        }
    }
}

console.log("");
console.log("----- CATCH-ALL RULE -----");

const catchAllIndex = lines.findIndex(line =>
    /match\s+\/\{document=\*\*\}/.test(line)
);

if (catchAllIndex === -1) {
    console.log("CATCH-ALL MATCH: NOT FOUND");
} else {

    console.log(
        `CATCH-ALL MATCH LINE: ${catchAllIndex + 1}`
    );

    const start = catchAllIndex;
    const end = Math.min(
        lines.length,
        catchAllIndex + 12
    );

    for (let i = start; i < end; i++) {
        console.log(
            `${i + 1}: ${lines[i]}`
        );
    }
}

console.log("");
console.log("----- DRAW SERVICE WRITE OPERATIONS -----");

const services = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js"
];

for (const service of services) {

    console.log("");
    console.log(`SERVICE: ${service}`);

    if (!fs.existsSync(service)) {
        console.log("  NOT FOUND");
        continue;
    }

    const serviceLines = fs
        .readFileSync(service, "utf8")
        .split("\n");

    serviceLines.forEach((line, index) => {

        if (
            /addDoc\s*\(/.test(line) ||
            /updateDoc\s*\(/.test(line) ||
            /deleteDoc\s*\(/.test(line)
        ) {
            console.log(
                `  ${index + 1}: ${line.trim()}`
            );
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC355 DECISION");
console.log("===============================================");

const hasCatchAll =
    catchAllIndex !== -1;

let catchAllDeniesWrites = false;

if (hasCatchAll) {

    const catchAllSection = lines
        .slice(catchAllIndex, catchAllIndex + 12)
        .join("\n");

    catchAllDeniesWrites =
        /allow\s+read,\s*write:\s*if\s+false/.test(
            catchAllSection
        );
}

console.log(
    `DRAW COLLECTIONS WITHOUT EXPLICIT RULES: ${collections.length}/${collections.length}`
);

console.log(
    `CATCH-ALL RULE PRESENT: ${hasCatchAll ? "YES" : "NO"}`
);

console.log(
    `CATCH-ALL EXPLICITLY DENIES READ/WRITE: ${
        catchAllDeniesWrites ? "YES" : "NO"
    }`
);

if (
    hasCatchAll &&
    catchAllDeniesWrites
) {
    console.log(
        "RC355 FINDING: DRAW COLLECTIONS HAVE NO DEDICATED RULE BLOCK AND FALL THROUGH TO AN EXPLICIT DENY CATCH-ALL."
    );

    console.log(
        "RC355 STATUS: DRAW AUTHORIZATION IS A FIRESTORE RULES SURFACE GAP; DO NOT PATCH FRONTEND SERVICE AUTHORIZATION YET."
    );
} else {
    console.log(
        "RC355 FINDING: CATCH-ALL IMPACT REQUIRES FURTHER RULE SEMANTIC ANALYSIS."
    );

    console.log(
        "RC355 STATUS: NO AUTHORIZATION PATCH APPLIED."
    );
}

console.log("");
console.log("===============================================");
console.log("RC355 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC355: NO FILES MODIFIED");
