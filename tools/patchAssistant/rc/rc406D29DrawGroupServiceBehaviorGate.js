import fs from "fs/promises";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D29 — DRAW GROUP SERVICE BEHAVIOR GATE");
console.log("===============================================");

console.log("");
console.log("=== CURRENT PRODUCTION SOURCE ===");

const requiredFunctions = [
    "createDrawGroup",
    "getDrawGroups",
    "getDrawGroupById",
    "updateGroupStatus"
];

let failed = false;

for (const name of requiredFunctions) {
    const pattern = new RegExp(
        `export async function ${name}\\s*\\(`
    );

    const pass = pattern.test(source);

    console.log(
        `${pass ? "PASS" : "FAIL"} — exported function: ${name}`
    );

    if (!pass) {
        failed = true;
    }
}

console.log("");
console.log("=== CREATE CONTRACT ===");

const createChecks = [
    [
        "Draft status assigned",
        /groupData\.status\s*=\s*"Draft"/
    ],
    [
        "cooperative ownership enforced",
        /profile\.role === "cooperative_admin"\s*\?\s*profile\.cooperativeId/
    ],
    [
        "createdAt assigned",
        /groupData\.createdAt\s*=\s*serverTimestamp\(\)/
    ],
    [
        "document persisted",
        /await addDoc\(/
    ],
    [
        "document id returned",
        /return docRef\.id/
    ]
];

for (const [name, pattern] of createChecks) {
    const pass = pattern.test(source);

    console.log(
        `${pass ? "PASS" : "FAIL"} — ${name}`
    );

    if (!pass) {
        failed = true;
    }
}

console.log("");
console.log("=== READ ISOLATION CONTRACT ===");

const readChecks = [
    [
        "list filters cooperative-owned groups",
        /data\.cooperativeId\s*!==\s*profile\.cooperativeId/
    ],
    [
        "getById filters cooperative-owned groups",
        /profile\.role === "cooperative_admin"[\s\S]*?data\.cooperativeId\s*!==\s*profile\.cooperativeId/
    ]
];

for (const [name, pattern] of readChecks) {
    const pass = pattern.test(source);

    console.log(
        `${pass ? "PASS" : "FAIL"} — ${name}`
    );

    if (!pass) {
        failed = true;
    }
}

console.log("");
console.log("=== STATUS UPDATE CONTRACT ===");

const statusChecks = [
    [
        "administrator authorization",
        /Unauthorized:\s*only authorized administrators can update draw group status\.?/i
    ],
    [
        "group reference",
        /const groupRef\s*=\s*doc\(/
    ],
    [
        "group fetched",
        /await getDoc\(groupRef\)/
    ],
    [
        "missing group rejected",
        /Draw group not found/
    ],
    [
        "ownership isolation",
        /groupData\.cooperativeId\s*!==\s*profile\.cooperativeId/
    ],
    [
        "status persisted",
        /await updateDoc\(/
    ]
];

for (const [name, pattern] of statusChecks) {
    const pass = pattern.test(source);

    console.log(
        `${pass ? "PASS" : "FAIL"} — ${name}`
    );

    if (!pass) {
        failed = true;
    }
}

console.log("");
console.log("=== NODE SYNTAX ===");

const { spawnSync } = await import("child_process");

const syntax = spawnSync(
    process.execPath,
    ["--check", path],
    {
        encoding: "utf8"
    }
);

console.log(
    syntax.status === 0
        ? "PASS — Node module syntax"
        : "FAIL — Node module syntax"
);

if (syntax.stdout) {
    console.log(syntax.stdout);
}

if (syntax.stderr) {
    console.log(syntax.stderr);
}

if (syntax.status !== 0) {
    failed = true;
}

console.log("");
console.log("=== RESULT ===");

if (failed) {
    console.log("RC406-D29 RESULT: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC406-D29 RESULT: PASS");
}

console.log("===============================================");
console.log("RC406-D29 COMPLETE");
console.log("===============================================");
