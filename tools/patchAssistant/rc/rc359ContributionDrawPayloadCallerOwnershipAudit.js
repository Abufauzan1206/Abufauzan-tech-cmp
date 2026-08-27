import fs from "fs";

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js"
];

const searchRoots = [
    "js",
    "tools"
];

const functionCalls = [
    "createDrawGroup",
    "addParticipantToGroup",
    "createDrawBox",
    "saveAssignments"
];

const payloadVariables = [
    "groupData",
    "participantData",
    "boxData"
];

console.log("===============================================");
console.log("RC359 DRAW PAYLOAD CALLER / OWNERSHIP AUDIT");
console.log("===============================================");

console.log("");
console.log("----- SERVICE SIGNATURES -----");

for (const target of targets) {

    if (!fs.existsSync(target)) {
        console.log(`NOT FOUND: ${target}`);
        continue;
    }

    const lines = fs.readFileSync(target, "utf8").split("\n");

    console.log("");
    console.log(`===== ${target} =====`);

    lines.forEach((line, index) => {

        if (
            /export\s+(async\s+)?function\s+/.test(line)
        ) {
            console.log(
                `${index + 1}: ${line.trim()}`
            );
        }
    });
}

console.log("");
console.log("===============================================");
console.log("----- CALL-SITE SEARCH -----");
console.log("===============================================");

function walk(dir) {

    if (!fs.existsSync(dir)) {
        return [];
    }

    const result = [];

    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true
    })) {

        if (
            entry.name === "node_modules" ||
            entry.name === ".git"
        ) {
            continue;
        }

        const full = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
            result.push(...walk(full));
        } else if (
            entry.name.endsWith(".js") ||
            entry.name.endsWith(".mjs")
        ) {
            result.push(full);
        }
    }

    return result;
}

const files = [
    ...new Set(
        searchRoots.flatMap(root => walk(root))
    )
];

for (const fn of functionCalls) {

    console.log("");
    console.log(`===== CALLS: ${fn} =====`);

    let count = 0;

    for (const file of files) {

        const lines = fs.readFileSync(file, "utf8")
            .split("\n");

        lines.forEach((line, index) => {

            if (
                line.includes(`${fn}(`) &&
                !targets.includes(file)
            ) {

                count++;

                const start = Math.max(0, index - 8);
                const end = Math.min(
                    lines.length,
                    index + 16
                );

                console.log("");
                console.log(
                    `FILE: ${file}`
                );

                console.log(
                    `CALL LINE: ${index + 1}`
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
    console.log(
        `TOTAL EXTERNAL CALL-SITE REFERENCES: ${count}`
    );
}

console.log("");
console.log("===============================================");
console.log("----- PAYLOAD OWNERSHIP FIELD SEARCH -----");
console.log("===============================================");

const ownershipFields = [
    "cooperativeId",
    "coopId",
    "groupId",
    "memberId",
    "userId",
    "adminId",
    "administratorId",
    "createdBy",
    "createdByUserId",
    "ownerId",
    "participantId"
];

for (const field of ownershipFields) {

    console.log("");
    console.log(`FIELD: ${field}`);

    let count = 0;

    for (const file of files) {

        const lines = fs.readFileSync(file, "utf8")
            .split("\n");

        lines.forEach((line, index) => {

            if (
                new RegExp(
                    `\\b${field}\\b`,
                    "i"
                ).test(line)
            ) {

                count++;

                console.log(
                    `  ${file}:${index + 1}: ${line.trim()}`
                );
            }
        });
    }

    console.log(
        `  TOTAL: ${count}`
    );
}

console.log("");
console.log("===============================================");
console.log("----- PAYLOAD OBJECT CONSTRUCTION SEARCH -----");
console.log("===============================================");

for (const variable of payloadVariables) {

    console.log("");
    console.log(`===== ${variable} =====`);

    let count = 0;

    for (const file of files) {

        const lines = fs.readFileSync(file, "utf8")
            .split("\n");

        lines.forEach((line, index) => {

            if (
                new RegExp(
                    `\\b${variable}\\b\\s*=|` +
                    `\\b${variable}\\b\\s*:` ,
                    "i"
                ).test(line)
            ) {

                count++;

                const start = Math.max(
                    0,
                    index - 6
                );

                const end = Math.min(
                    lines.length,
                    index + 12
                );

                console.log("");
                console.log(
                    `FILE: ${file}`
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
    console.log(
        `TOTAL CONSTRUCTION REFERENCES: ${count}`
    );
}

console.log("");
console.log("===============================================");
console.log("RC359 DECISION");
console.log("===============================================");

console.log(
    "RC359 FINDING: DRAW FIRESTORE AUTHORIZATION CANNOT YET BE FINALIZED UNTIL THE CALLERS OF THE DRAW SERVICES ARE CORRELATED WITH THE ACTUAL OWNERSHIP FIELDS PASSED INTO EACH WRITE."
);

console.log(
    "RC359 SECURITY REQUIREMENT: DO NOT ASSUME groupId IMPLIES cooperativeId WITHOUT VERIFYING THE GROUP OWNERSHIP MODEL."
);

console.log(
    "RC359 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC359 NEXT DECISION: DETERMINE WHETHER EXISTING CALLERS ALREADY SUPPLY A TRUSTWORTHY COOPERATIVE OWNERSHIP FIELD OR WHETHER THE DRAW DOCUMENT SCHEMA REQUIRES AN OWNERSHIP-LAYER PATCH."
);

console.log("");
console.log("===============================================");
console.log("RC359 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC359: NO FILES MODIFIED");
