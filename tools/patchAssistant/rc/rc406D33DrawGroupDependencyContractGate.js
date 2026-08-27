import fs from "fs/promises";
import crypto from "crypto";
import { spawnSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D33 — DRAW GROUP DEPENDENCY CONTRACT GATE");
console.log("===============================================");

let failed = false;

const checks = [
    {
        name: "Firebase Firestore module present",
        pass: /firebase-firestore\.js/.test(source)
    },
    {
        name: "Firestore collection dependency present",
        pass: /\bcollection\b/.test(source)
    },
    {
        name: "Firestore document dependency present",
        pass: /\bdoc\b/.test(source)
    },
    {
        name: "Firestore addDoc dependency present",
        pass: /\baddDoc\b/.test(source)
    },
    {
        name: "Firestore getDocs dependency present",
        pass: /\bgetDocs\b/.test(source)
    },
    {
        name: "Firestore getDoc dependency present",
        pass: /\bgetDoc\b/.test(source)
    },
    {
        name: "Firestore updateDoc dependency present",
        pass: /\bupdateDoc\b/.test(source)
    },
    {
        name: "serverTimestamp dependency present",
        pass: /\bserverTimestamp\b/.test(source)
    },
    {
        name: "Firebase auth current-user dependency present",
        pass: /\bauth\b/.test(source)
    },
    {
        name: "Firestore database instance present",
        pass: /\bdb\b/.test(source)
    },
    {
        name: "authentication current user accessed",
        pass: /auth\.currentUser/.test(source)
    },
    {
        name: "drawGroups collection referenced",
        pass: /["']drawGroups["']/.test(source)
    }
];

console.log("");
console.log("=== DEPENDENCY CHECKS ===");

for (const check of checks) {
    console.log(
        `${check.pass ? "PASS" : "FAIL"} — ${check.name}`
    );

    if (!check.pass) {
        failed = true;
    }
}

console.log("");
console.log("=== SERVICE EXPORT CONTRACT ===");

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
    console.log("RC406-D33 RESULT: FAIL");
    console.log("===============================================");
    process.exitCode = 1;
} else {
    console.log("RC406-D33 RESULT: PASS");
    console.log("===============================================");
}

console.log("RC406-D33 COMPLETE");
console.log("===============================================");
