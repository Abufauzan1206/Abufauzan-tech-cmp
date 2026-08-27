import fs from "fs";

const services = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js"
];

const collections = [
    "drawGroups",
    "drawParticipants",
    "drawBoxes"
];

console.log("===============================================");
console.log("RC356 CONTRIBUTION-DRAW AUTHORIZATION MATRIX AUDIT");
console.log("===============================================");

console.log("");
console.log("----- SERVICE EXPORTS / OPERATIONS -----");

for (const target of services) {

    console.log("");
    console.log(`===== ${target} =====`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const lines = fs
        .readFileSync(target, "utf8")
        .split("\n");

    console.log(`STATUS: FOUND`);
    console.log(`LINES: ${lines.length}`);

    lines.forEach((line, index) => {

        if (/export\s+(async\s+)?function\s+/.test(line)) {
            console.log(
                `${index + 1}: ${line.trim()}`
            );
        }
    });
}

console.log("");
console.log("----- FIRESTORE OPERATION CONTEXT -----");

for (const target of services) {

    if (!fs.existsSync(target)) {
        continue;
    }

    const lines = fs
        .readFileSync(target, "utf8")
        .split("\n");

    console.log("");
    console.log(`===== ${target} =====`);

    lines.forEach((line, index) => {

        if (
            /addDoc\s*\(/.test(line) ||
            /updateDoc\s*\(/.test(line) ||
            /deleteDoc\s*\(/.test(line) ||
            /getDoc\s*\(/.test(line) ||
            /getDocs\s*\(/.test(line)
        ) {

            const start = Math.max(0, index - 5);
            const end = Math.min(
                lines.length,
                index + 9
            );

            console.log("");
            console.log(
                `--- OPERATION AROUND LINE ${index + 1} ---`
            );

            for (let i = start; i < end; i++) {
                console.log(
                    `${i + 1}: ${lines[i]}`
                );
            }
        }
    });
}

console.log("");
console.log("----- DRAW DATA-AUTHORIZATION SIGNALS -----");

const allServiceText = services
    .filter(fs.existsSync)
    .map(file => fs.readFileSync(file, "utf8"))
    .join("\n");

const signals = [
    "groupId",
    "memberId",
    "cooperativeId",
    "userId",
    "administrator",
    "admin",
    "super_admin",
    "cooperative_admin",
    "member",
    "status",
    "assigned",
    "revealed",
    "reserved",
    "available",
    "month",
    "boxId"
];

for (const signal of signals) {

    const occurrences =
        allServiceText.split("\n")
            .map((line, index) => ({
                line,
                index
            }))
            .filter(({ line }) =>
                line.toLowerCase().includes(
                    signal.toLowerCase()
                )
            );

    console.log(
        `${signal}: ${occurrences.length} occurrence(s)`
    );
}

console.log("");
console.log("===============================================");
console.log("RC356 CURRENT FIRESTORE ROLE MODEL");
console.log("===============================================");

if (!fs.existsSync("firestore.rules")) {
    console.log("firestore.rules: NOT FOUND");
    process.exit(1);
}

const rules = fs.readFileSync(
    "firestore.rules",
    "utf8"
);

const roleSignals = [
    "isSuperAdmin",
    "isCooperativeAdmin",
    "isMember",
    "isMemberOfCooperative",
    "belongsToCooperative",
    "isOwnUserProfile",
    "super_admin",
    "cooperative_admin",
    "member"
];

const ruleLines = rules.split("\n");

for (const signal of roleSignals) {

    const found = ruleLines
        .map((line, index) => ({
            line,
            index
        }))
        .filter(({ line }) =>
            line.includes(signal)
        );

    console.log("");
    console.log(
        `${signal}: ${found.length} occurrence(s)`
    );

    for (const item of found) {
        console.log(
            `  ${item.index + 1}: ${item.line.trim()}`
        );
    }
}

console.log("");
console.log("===============================================");
console.log("RC356 COLLECTION / OPERATION MATRIX");
console.log("===============================================");

for (const collection of collections) {

    console.log("");
    console.log(`COLLECTION: ${collection}`);

    if (collection === "drawGroups") {

        console.log(
            "  SERVICE OPERATIONS: create / read / update"
        );

    } else if (collection === "drawParticipants") {

        console.log(
            "  SERVICE OPERATIONS: create / read"
        );

    } else if (collection === "drawBoxes") {

        console.log(
            "  SERVICE OPERATIONS: create / read / update"
        );
    }
}

console.log("");
console.log("===============================================");
console.log("RC356 DECISION");
console.log("===============================================");

console.log(
    "RC356 FINDING: DRAW COLLECTION AUTHORIZATION MUST BE DERIVED FROM ACTUAL SERVICE OPERATIONS, DATA OWNERSHIP FIELDS, AND THE EXISTING ROLE MODEL."
);

console.log(
    "RC356 STATUS: NO FIRESTORE RULES PATCH APPLIED."
);

console.log(
    "RC356 NEXT DECISION: ESTABLISH THE MINIMUM-PERMISSION RULE MATRIX BEFORE WRITING DRAW RULE BLOCKS."
);

console.log("");
console.log("===============================================");
console.log("RC356 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC356: NO FILES MODIFIED");
