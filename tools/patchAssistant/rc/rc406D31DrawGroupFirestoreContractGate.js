import fs from "fs/promises";
import crypto from "crypto";
import { spawnSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D31 — DRAW GROUP FIRESTORE CONTRACT GATE");
console.log("===============================================");

let failed = false;

const checks = [
    {
        name: "Firestore module imported",
        pass: /firebase-firestore\.js/.test(source)
    },
    {
        name: "collection imported",
        pass: /\bcollection\b/.test(source)
    },
    {
        name: "doc imported",
        pass: /\bdoc\b/.test(source)
    },
    {
        name: "addDoc imported",
        pass: /\baddDoc\b/.test(source)
    },
    {
        name: "getDocs imported",
        pass: /\bgetDocs\b/.test(source)
    },
    {
        name: "getDoc imported",
        pass: /\bgetDoc\b/.test(source)
    },
    {
        name: "updateDoc imported",
        pass: /\bupdateDoc\b/.test(source)
    },
    {
        name: "serverTimestamp imported",
        pass: /\bserverTimestamp\b/.test(source)
    },
    {
        name: "drawGroups collection used",
        pass: /["']drawGroups["']/.test(source)
    },
    {
        name: "create uses addDoc",
        pass: /await addDoc\(/.test(source)
    },
    {
        name: "list uses getDocs",
        pass: /await getDocs\(/.test(source)
    },
    {
        name: "getById uses getDoc",
        pass: /await getDoc\(/.test(source)
    },
    {
        name: "status update uses updateDoc",
        pass: /await updateDoc\(/.test(source)
    },
    {
        name: "createdAt uses serverTimestamp",
        pass: /createdAt\s*=\s*serverTimestamp\(\)/.test(source)
    }
];

console.log("");
console.log("=== FIRESTORE CONTRACT ===");

for (const check of checks) {
    console.log(
        `${check.pass ? "PASS" : "FAIL"} — ${check.name}`
    );

    if (!check.pass) {
        failed = true;
    }
}

console.log("");
console.log("=== REQUIRED SERVICE EXPORTS ===");

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
console.log("=== NODE MODULE SYNTAX ===");

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
    console.log("RC406-D31 RESULT: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC406-D31 RESULT: PASS");
}

console.log("===============================================");
console.log("RC406-D31 COMPLETE");
console.log("===============================================");
