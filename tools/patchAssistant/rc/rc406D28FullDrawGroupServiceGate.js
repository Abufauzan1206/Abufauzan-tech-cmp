import fs from "fs/promises";
import crypto from "crypto";
import { spawnSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const checks = [
    {
        name: "getCurrentUserProfile present",
        pass: /async function getCurrentUserProfile\s*\(/.test(source)
    },
    {
        name: "createDrawGroup exported",
        pass: /export async function createDrawGroup\s*\(/.test(source)
    },
    {
        name: "getDrawGroups exported",
        pass: /export async function getDrawGroups\s*\(/.test(source)
    },
    {
        name: "getDrawGroupById exported",
        pass: /export async function getDrawGroupById\s*\(/.test(source)
    },
    {
        name: "updateGroupStatus exported",
        pass: /export async function updateGroupStatus\s*\(/.test(source)
    },
    {
        name: "create authorization guard",
        pass: /Only authorized administrators can create draw groups/.test(source)
    },
    {
        name: "create cooperative ownership guard",
        pass: /profile\.role === "cooperative_admin"[\s\S]*?!profile\.cooperativeId/.test(source)
    },
    {
        name: "create cooperative ownership assignment",
        pass: /profile\.role === "cooperative_admin"\s*\?\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "create defaults status to Draft",
        pass: /groupData\.status\s*=\s*"Draft"/.test(source)
    },
    {
        name: "create persists draw group",
        pass: /await addDoc\(/.test(source)
    },
    {
        name: "create returns document id",
        pass: /return docRef\.id/.test(source)
    },
    {
        name: "list uses drawGroups collection",
        pass: /collection\(\s*db,\s*"drawGroups"\s*\)/.test(source)
    },
    {
        name: "list cooperative isolation",
        pass: /data\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "getById cooperative isolation",
        pass: /profile\.role === "cooperative_admin"[\s\S]*?data\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "status update authorization",
        pass: /(?:Only authorized administrators can update draw group status|Unauthorized: only authorized administrators can update draw group status)/.test(source)
    },
    {
        name: "status update fetches group",
        pass: /const groupSnap\s*=\s*await getDoc\(groupRef\)/.test(source)
    },
    {
        name: "status update missing-group protection",
        pass: /Draw group not found/.test(source)
    },
    {
        name: "status update ownership isolation",
        pass: /groupData\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "status update persists",
        pass: /await updateDoc\(/.test(source)
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D28 — FULL DRAW GROUP SERVICE CONTRACT GATE");
console.log("===============================================");

let failed = false;

for (const check of checks) {
    console.log(
        `${check.pass ? "PASS" : "FAIL"} — ${check.name}`
    );

    if (!check.pass) {
        failed = true;
    }
}

console.log("");
console.log("=== STRUCTURAL BALANCE ===");

let braces = 0;
let parens = 0;
let brackets = 0;

for (const char of source) {
    if (char === "{") braces++;
    if (char === "}") braces--;
    if (char === "(") parens++;
    if (char === ")") parens--;
    if (char === "[") brackets++;
    if (char === "]") brackets--;
}

console.log("BRACES:", braces);
console.log("PARENTHESES:", parens);
console.log("BRACKETS:", brackets);

const balanced =
    braces === 0 &&
    parens === 0 &&
    brackets === 0;

console.log(
    balanced
        ? "BALANCE: PASS"
        : "BALANCE: FAIL"
);

if (!balanced) {
    failed = true;
}

console.log("");
console.log("=== NODE MODULE SYNTAX ===");

const syntax = spawnSync(
    process.execPath,
    ["--check", path],
    { encoding: "utf8" }
);

if (syntax.stdout) {
    console.log(syntax.stdout);
}

if (syntax.stderr) {
    console.log(syntax.stderr);
}

console.log(
    syntax.status === 0
        ? "MODULE SYNTAX: PASS"
        : "MODULE SYNTAX: FAIL"
);

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
    console.log("RC406-D28 RESULT: FAIL");
    console.log("===============================================");
    process.exitCode = 1;
} else {
    console.log("RC406-D28 RESULT: PASS");
    console.log("===============================================");
}

console.log("RC406-D28 COMPLETE");
console.log("===============================================");
