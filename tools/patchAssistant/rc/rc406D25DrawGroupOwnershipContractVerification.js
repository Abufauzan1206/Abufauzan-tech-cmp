import fs from "fs/promises";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const checks = [
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
        name: "cooperative admin ownership guard",
        pass: /profile\.role === "cooperative_admin"\s*&&\s*!profile\.cooperativeId/.test(source)
    },
    {
        name: "cooperative ownership assignment",
        pass: /profile\.role === "cooperative_admin"\s*\?\s*profile\.cooperativeId/.test(source)
    },
    {
        name: "draw group collection",
        pass: /collection\(\s*db,\s*"drawGroups"\s*\)/.test(source)
    },
    {
        name: "createDrawGroup persists document",
        pass: /await addDoc\(/.test(source)
    },
    {
        name: "createDrawGroup returns document id",
        pass: /return docRef\.id/.test(source)
    },
    {
        name: "cooperative list isolation",
        pass: /data\.cooperativeId !== profile\.cooperativeId/.test(source)
    },
    {
        name: "cooperative getById isolation",
        pass: /profile\.role === "cooperative_admin"[\s\S]*?data\.cooperativeId !== profile\.cooperativeId/.test(source)
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D25 — DRAW GROUP OWNERSHIP CONTRACT VERIFICATION");
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
console.log("=== PRODUCTION SOURCE HASH ===");

const crypto = await import("crypto");
const hash = crypto
    .createHash("sha256")
    .update(source)
    .digest("hex");

console.log(hash);

console.log("");
console.log("===============================================");

if (failed) {
    console.log("RC406-D25 RESULT: FAIL");
    console.log("===============================================");
    process.exitCode = 1;
} else {
    console.log("RC406-D25 RESULT: PASS");
    console.log("===============================================");
}

console.log("RC406-D25 COMPLETE");
console.log("===============================================");
