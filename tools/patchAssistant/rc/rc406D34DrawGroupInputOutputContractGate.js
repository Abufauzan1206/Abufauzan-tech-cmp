import fs from "fs/promises";
import crypto from "crypto";
import { spawnSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D34 — DRAW GROUP INPUT/OUTPUT CONTRACT GATE");
console.log("===============================================");

let failed = false;

const checks = [
    {
        name: "createDrawGroup accepts input",
        pass: /export async function createDrawGroup\s*\([^)]*\)/.test(source)
    },
    {
        name: "create validates administrator profile",
        pass: /getCurrentUserProfile\(\)/.test(source)
    },
    {
        name: "create builds groupData",
        pass: /const groupData\s*=/.test(source)
    },
    {
        name: "create assigns cooperativeId",
        pass: /cooperativeId\s*=/.test(source)
    },
    {
        name: "create assigns Draft status",
        pass: /groupData\.status\s*=\s*"Draft"/.test(source)
    },
    {
        name: "create assigns createdAt",
        pass: /groupData\.createdAt\s*=\s*serverTimestamp\(\)/.test(source)
    },
    {
        name: "create returns document id",
        pass: /return docRef\.id/.test(source)
    },
    {
        name: "getDrawGroups returns collection results",
        pass:
            /const\s+groups\s*=\s*\[\s*\]/.test(source) &&
            /groups\.push\s*\(\s*\{[\s\S]*?id:\s*doc\.id/.test(source) &&
            /return\s+groups\s*;?/.test(source)
    },
    {
        name: "getDrawGroupById accepts groupId",
        pass: /export async function getDrawGroupById\s*\(\s*groupId\s*\)/.test(source)
    },
    {
        name: "getDrawGroupById returns document data",
        pass:
            /group\s*=\s*\{[\s\S]*?id:\s*doc\.id[\s\S]*?\.\.\.data[\s\S]*?\}/.test(source) &&
            /return\s+group\s*;?/.test(source)
    },
    {
        name: "getDrawGroupById rejects missing group",
        pass: /Draw group not found/.test(source)
    },
    {
        name: "updateGroupStatus accepts groupId and status",
        pass: /export async function updateGroupStatus\s*\(\s*groupId\s*,\s*status\s*\)/.test(source)
    },
    {
        name: "updateGroupStatus persists status",
        pass: /await updateDoc\(/.test(source)
    }
];

console.log("");
console.log("=== INPUT / OUTPUT CONTRACT CHECKS ===");

for (const check of checks) {
    console.log(
        `${check.pass ? "PASS" : "FAIL"} — ${check.name}`
    );

    if (!check.pass) {
        failed = true;
    }
}

console.log("");
console.log("=== REQUIRED EXPORTS ===");

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
    console.log("RC406-D34 RESULT: FAIL");
    console.log("===============================================");
    process.exitCode = 1;
} else {
    console.log("RC406-D34 RESULT: PASS");
    console.log("===============================================");
}

console.log("RC406-D34 COMPLETE");
console.log("===============================================");
