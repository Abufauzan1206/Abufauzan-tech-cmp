import fs from "fs/promises";
import crypto from "crypto";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const checks = [
    {
        name: "updateGroupStatus exported",
        pass: /export async function updateGroupStatus\s*\(/.test(source)
    },
    {
        name: "profile loaded",
        pass: /const profile\s*=\s*await getCurrentUserProfile\(\)/.test(source)
    },
    {
        name: "authorized role guard",
        pass: /profile\.role !== "super_admin"[\s\S]*?profile\.role !== "cooperative_admin"/.test(
            source
        )
    },
    {
        name: "draw group reference created",
        pass: /const groupRef\s*=\s*doc\(/.test(source)
    },
    {
        name: "draw group fetched",
        pass: /const groupSnap\s*=\s*await getDoc\(groupRef\)/.test(source)
    },
    {
        name: "draw group existence guard",
        pass: /if \(!groupSnap\.exists\(\)\)/.test(source)
    },
    {
        name: "draw group data loaded",
        pass: /const groupData\s*=\s*groupSnap\.data\(\)/.test(source)
    },
    {
        name: "cooperative ownership isolation",
        pass: /groupData\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "status update remains present",
        pass: /await updateDoc\(/.test(source)
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D27 — DRAW GROUP STATUS OWNERSHIP POST-REPAIR GATE");
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
console.log("=== BRACE / PARENTHESIS / BRACKET BALANCE ===");

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
console.log("=== MODULE SYNTAX CHECK ===");

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
        ? "MODULE SYNTAX: PASS"
        : "MODULE SYNTAX: FAIL"
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
    console.log("RC406-D27 RESULT: FAIL");
    console.log("===============================================");
    process.exitCode = 1;
} else {
    console.log("RC406-D27 RESULT: PASS");
    console.log("===============================================");
}

console.log("RC406-D27 COMPLETE");
console.log("===============================================");
