import fs from "fs";

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawReservationService.js",
    "js/services/drawPreparationService.js"
];

const roots = ["js", "tools"];

console.log("===============================================");
console.log("RC361 DRAW GROUP → COOPERATIVE OWNERSHIP TRACE");
console.log("===============================================");

function walk(dir) {
    if (!fs.existsSync(dir)) return [];

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
        roots.flatMap(root => walk(root))
    )
];

console.log("");
console.log("----- DRAW SERVICE GROUP REFERENCES -----");

for (const target of targets) {
    if (!fs.existsSync(target)) continue;

    const lines = fs.readFileSync(target, "utf8").split("\n");

    console.log("");
    console.log(`===== ${target} =====`);

    lines.forEach((line, index) => {
        if (
            /\bgroupId\b|\bcooperativeId\b|\bgroup\b|\bcooperative\b/i.test(line)
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("");
console.log("===============================================");
console.log("----- GROUP / COOPERATIVE DATA SOURCES -----");
console.log("===============================================");

const signals = [
    "collection(\"groups\")",
    "collection('groups')",
    "\"groups\"",
    "'groups'",
    "cooperativeId",
    "groupId",
    "cooperative",
    "drawGroup"
];

for (const signal of signals) {
    console.log("");
    console.log(`===== SIGNAL: ${signal} =====`);

    let count = 0;

    for (const file of files) {
        const lines = fs.readFileSync(file, "utf8").split("\n");

        lines.forEach((line, index) => {
            if (line.includes(signal)) {
                count++;
                console.log(
                    `${file}:${index + 1}: ${line.trim()}`
                );
            }
        });
    }

    console.log(`TOTAL: ${count}`);
}

console.log("");
console.log("===============================================");
console.log("----- GROUP DOCUMENT READ / WRITE CONTEXT -----");
console.log("===============================================");

for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split("\n");

    lines.forEach((line, index) => {
        if (
            /getDoc\s*\(|setDoc\s*\(|addDoc\s*\(|updateDoc\s*\(|collection\s*\(/.test(line) &&
            /group|cooperative/i.test(
                lines
                    .slice(
                        Math.max(0, index - 5),
                        Math.min(lines.length, index + 6)
                    )
                    .join("\n")
            )
        ) {
            console.log("");
            console.log(`FILE: ${file}`);
            console.log(`CONTEXT LINE: ${index + 1}`);

            const start = Math.max(0, index - 8);
            const end = Math.min(lines.length, index + 12);

            for (let i = start; i < end; i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
        }
    });
}

console.log("");
console.log("===============================================");
console.log("----- FIRESTORE GROUP RULE CONTEXT -----");
console.log("===============================================");

if (fs.existsSync("firestore.rules")) {
    const rules = fs.readFileSync(
        "firestore.rules",
        "utf8"
    ).split("\n");

    rules.forEach((line, index) => {
        if (
            /match.*group|groups|cooperativeId|isCooperativeAdmin|isMemberOfCooperative|belongsToCooperative|userProfile/.test(line)
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
} else {
    console.log("firestore.rules: NOT FOUND");
}

console.log("");
console.log("===============================================");
console.log("RC361 DECISION");
console.log("===============================================");

console.log(
    "RC361 FINDING: IDENTIFY THE AUTHORITATIVE GROUP → COOPERATIVE OWNERSHIP RELATIONSHIP BEFORE DRAW RULES ARE WRITTEN."
);

console.log(
    "RC361 SECURITY REQUIREMENT: DRAW AUTHORIZATION MUST REUSE AN EXISTING SERVER-VERIFIABLE OWNERSHIP PATH WHEREVER POSSIBLE."
);

console.log(
    "RC361 STATUS: NO FILES MODIFIED."
);

console.log(
    "RC361 NEXT DECISION: USE THE TRACE RESULT TO DETERMINE WHETHER FIRESTORE RULES CAN RESOLVE DRAW OWNERSHIP DIRECTLY OR WHETHER A MINIMAL OWNERSHIP-LAYER PATCH IS REQUIRED."
);

console.log("");
console.log("===============================================");
console.log("RC361 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC361: NO FILES MODIFIED");
