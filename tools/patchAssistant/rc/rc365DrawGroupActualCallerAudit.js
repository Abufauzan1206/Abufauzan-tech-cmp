import fs from "fs";

console.log("===============================================");
console.log("RC365 DRAW GROUP ACTUAL CALLER AUDIT");
console.log("===============================================");

const roots = [
    "js",
    "components",
    "core",
    "pages"
];

const skip = new Set([
    "node_modules",
    ".git"
]);

const files = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (skip.has(entry.name)) continue;

        const path = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
            walk(path);
            continue;
        }

        if (entry.name.endsWith(".js")) {
            files.push(path);
        }
    }
}

for (const root of roots) {
    walk(root);
}

const callers = [];

for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split("\n");

    lines.forEach((line, index) => {
        if (/createDrawGroup\s*\(/.test(line)) {
            callers.push({
                file,
                line: index + 1
            });
        }
    });
}

console.log("");
console.log(`FILES SCANNED: ${files.length}`);
console.log(`createDrawGroup REFERENCES: ${callers.length}`);

for (const caller of callers) {
    console.log("");
    console.log("===============================================");
    console.log(`CALLER: ${caller.file}:${caller.line}`);
    console.log("===============================================");

    const lines = fs.readFileSync(caller.file, "utf8").split("\n");

    const start = Math.max(0, caller.line - 18);
    const end = Math.min(lines.length, caller.line + 25);

    for (let i = start; i < end; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }

    console.log("");
    console.log("----- OWNERSHIP SIGNALS IN THIS CALLER -----");

    const ownership = [
        "cooperativeId",
        "groupId",
        "memberId",
        "participantId",
        "adminId",
        "createdBy",
        "createdByUserId",
        "ownerId",
        "userId",
        "auth.currentUser",
        "userProfile",
        "users/",
        "cooperatives/"
    ];

    lines.slice(start, end).forEach((line, offset) => {
        if (ownership.some(signal => line.includes(signal))) {
            console.log(
                `${start + offset + 1}: ${line.trim()}`
            );
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC365 DECISION");
console.log("===============================================");

if (callers.length === 0) {
    console.log(
        "RC365 FINDING: NO createDrawGroup CALLER FOUND IN THE SCANNED APPLICATION DIRECTORIES."
    );

    console.log(
        "RC365 NEXT DECISION: LOCATE THE DRAW-GROUP CREATION ENTRY POINT BEFORE AUTHORIZATION PATCHING."
    );
} else {
    console.log(
        "RC365 FINDING: ACTUAL createDrawGroup CALLER(S) IDENTIFIED; THEIR PAYLOAD MUST BE CLASSIFIED BEFORE ANY OWNERSHIP PATCH."
    );

    console.log(
        "RC365 SECURITY REQUIREMENT: DO NOT INFER cooperativeId FROM groupId, memberId, adminId, OR userId."
    );

    console.log(
        "RC365 NEXT DECISION: USE THE PRINTED CALLER PAYLOAD TO DETERMINE WHETHER EXISTING cooperativeId OWNERSHIP CAN BE REUSED."
    );
}

console.log(
    "RC365 STATUS: NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC365 AUDIT COMPLETE");
console.log("===============================================");
