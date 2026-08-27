import fs from "fs/promises";
import crypto from "crypto";
import { spawnSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D32 — DRAW GROUP RUNTIME CONTRACT GATE");
console.log("===============================================");

let failed = false;

const checks = [
    {
        name: "profile lookup is awaited",
        pass: /await getCurrentUserProfile\(\)/.test(source)
    },
    {
        name: "super admin authorization supported",
        pass: /profile\.role\s*!==\s*"super_admin"/.test(source)
    },
    {
        name: "cooperative admin authorization supported",
        pass: /profile\.role\s*!==\s*"cooperative_admin"/.test(source)
    },
    {
        name: "unauthorized create protection",
        pass: /Only authorized administrators can create draw groups/.test(source)
    },
    {
        name: "unauthorized status-update protection",
        pass: /Unauthorized:\s*only authorized administrators can update draw group status\.?/i.test(source)
    },
    {
        name: "cooperative ownership assigned during create",
        pass: /profile\.role === "cooperative_admin"\s*\?\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "cooperative ownership required",
        pass: /profile\.role === "cooperative_admin"[\s\S]*?!profile\.cooperativeId/.test(source)
    },
    {
        name: "list isolation enforced",
        pass: /data\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "getById isolation enforced",
        pass: /profile\.role === "cooperative_admin"[\s\S]*?data\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "status-update isolation enforced",
        pass: /groupData\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "missing group rejected",
        pass: /Draw group not found/.test(source)
    },
    {
        name: "Draft default preserved",
        pass: /groupData\.status\s*=\s*"Draft"/.test(source)
    },
    {
        name: "createdAt timestamp preserved",
        pass: /groupData\.createdAt\s*=\s*serverTimestamp\(\)/.test(source)
    },
    {
        name: "create persists to Firestore",
        pass: /await addDoc\(/.test(source)
    },
    {
        name: "list reads from Firestore",
        pass: /await getDocs\(/.test(source)
    },
    {
        name: "getById reads from Firestore",
        pass: /await getDoc\(/.test(source)
    },
    {
        name: "status update persists to Firestore",
        pass: /await updateDoc\(/.test(source)
    }
];

console.log("");
console.log("=== RUNTIME CONTRACT CHECKS ===");

for (const check of checks) {
    console.log(
        `${check.pass ? "PASS" : "FAIL"} — ${check.name}`
    );

    if (!check.pass) {
        failed = true;
    }
}

console.log("");
console.log("=== FUNCTION EXPORT CHECK ===");

const requiredExports = [
    "createDrawGroup",
    "getDrawGroups",
    "getDrawGroupById",
    "updateGroupStatus"
];

for (const name of requiredExports) {
    const pass = new RegExp(
        `export async function ${name}\\s*\\(`
    ).test(source);

    console.log(
        `${pass ? "PASS" : "FAIL"} — ${name}`
    );

    if (!pass) {
        failed = true;
    }
}

console.log("");
console.log("=== NODE SYNTAX CHECK ===");

const syntax = spawnSync(
    process.execPath,
    ["--check", path],
    {
        encoding: "utf8"
    }
);

console.log(
    syntax.status === 0
        ? "PASS — module syntax"
        : "FAIL — module syntax"
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
console.log("=== PRODUCTION SOURCE HASH ===");

const hash = crypto
    .createHash("sha256")
    .update(source)
    .digest("hex");

console.log(hash);

console.log("");
console.log("===============================================");

if (failed) {
    console.log("RC406-D32 RESULT: FAIL");
    console.log("===============================================");
    process.exitCode = 1;
} else {
    console.log("RC406-D32 RESULT: PASS");
    console.log("===============================================");
}

console.log("RC406-D32 COMPLETE");
console.log("===============================================");
