import fs from "fs/promises";
import path from "path";

const root = "js";
const target = "drawGroupService.js";

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D30 — DRAW GROUP SERVICE INTEGRATION SCAN");
console.log("===============================================");

const matches = [];

async function walk(dir) {
    const entries = await fs.readdir(dir, {
        withFileTypes: true
    });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await walk(fullPath);
            continue;
        }

        if (!entry.name.endsWith(".js")) {
            continue;
        }

        const source = await fs.readFile(fullPath, "utf8");

        if (
            fullPath !== "js/services/drawGroupService.js" &&
            source.includes(target)
        ) {
            matches.push(fullPath);
        }
    }
}

await walk(root);

console.log("");
console.log("=== IMPORT / REFERENCE SCAN ===");

if (matches.length === 0) {
    console.log("PASS — no unexpected drawGroupService references found.");
} else {
    for (const file of matches) {
        console.log(`REFERENCE — ${file}`);
    }
}

console.log("");
console.log("=== SERVICE EXPORT CONTRACT ===");

const source = await fs.readFile(
    "js/services/drawGroupService.js",
    "utf8"
);

const requiredExports = [
    "createDrawGroup",
    "getDrawGroups",
    "getDrawGroupById",
    "updateGroupStatus"
];

let failed = false;

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
console.log("=== NODE SYNTAX SWEEP ===");

const { spawnSync } = await import("child_process");

const syntax = spawnSync(
    process.execPath,
    ["--check", "js/services/drawGroupService.js"],
    {
        encoding: "utf8"
    }
);

console.log(
    syntax.status === 0
        ? "PASS — drawGroupService.js syntax"
        : "FAIL — drawGroupService.js syntax"
);

if (syntax.stderr) {
    console.log(syntax.stderr);
}

if (syntax.status !== 0) {
    failed = true;
}

console.log("");
console.log("=== RESULT ===");

if (failed) {
    console.log("RC406-D30 RESULT: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC406-D30 RESULT: PASS");
}

console.log("===============================================");
console.log("RC406-D30 COMPLETE");
console.log("===============================================");
