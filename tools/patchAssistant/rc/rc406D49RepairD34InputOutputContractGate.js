import fs from "fs/promises";
import crypto from "crypto";
import { spawnSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D49 — REPAIR D34 INPUT/OUTPUT CONTRACT GATE");
console.log("===============================================");

let repaired = source;

/*
 * D34 previously required:
 *
 *   return <identifier>.map(...)
 *
 * But the production contract intentionally constructs an explicit
 * `groups` collection and returns it:
 *
 *   const groups = [];
 *   ...
 *   return groups;
 *
 * D34B already verifies this contract.
 *
 * Likewise, getDrawGroupById intentionally constructs `group` and
 * returns it, rather than returning an inline object literal.
 */

repaired = repaired.replace(
    /name:\s*"getDrawGroups returns collection results",\s*pass:\s*\/return\\s\+\\w\+\\.map\\\(\/\.test\(source\)/,
    `name: "getDrawGroups returns collection results",
        pass:
            /const\s+groups\s*=\s*\[\s*\]/.test(source) &&
            /groups\.push\s*\(\s*\{[\s\S]*?id:\s*doc\.id/.test(source) &&
            /return\s+groups\s*;?/.test(source)`
);

repaired = repaired.replace(
    /name:\s*"getDrawGroupById returns document data",\s*pass:\s*\/return\\s*\\{\\[\\s\\S\\]*?id:\\s*groupId[\\s\\S\\]*?data\/.test(source)/,
    `name: "getDrawGroupById returns document data",
        pass:
            /group\s*=\s*\{[\s\S]*?id:\s*doc\.id[\s\S]*?\.\.\.data[\s\S]*?\}/.test(source) &&
            /return\s+group\s*;?/.test(source)`
);

/*
 * The previous regexes are deliberately checked after replacement.
 * If either legacy false-negative remains, fail loudly rather than
 * silently modifying the gate incorrectly.
 */

if (
    /name:\s*"getDrawGroups returns collection results",\s*pass:\s*\/return\\s\+\\w\+\\.map\\\(/.test(
        repaired
    )
) {
    throw new Error(
        "D34 repair failed: legacy getDrawGroups return-map assertion remains."
    );
}

if (
    /name:\s*"getDrawGroupById returns document data",\s*pass:\s*\/return\\s*\{/.test(
        repaired
    )
) {
    throw new Error(
        "D34 repair failed: legacy getDrawGroupById inline-return assertion remains."
    );
}

await fs.writeFile(path, repaired, "utf8");

const syntax = spawnSync(
    process.execPath,
    ["--check", path],
    { encoding: "utf8" }
);

if (syntax.status !== 0) {
    console.error(syntax.stderr || syntax.stdout);
    process.exitCode = 1;
    process.exit();
}

const finalSource = await fs.readFile(path, "utf8");

const hash = crypto
    .createHash("sha256")
    .update(finalSource)
    .digest("hex");

console.log("");
console.log("=== REPAIR CHECKS ===");
console.log(
    /const\s+groups\s*=\s*\[\s*\]/.test(finalSource)
        ? "PASS — explicit groups collection contract"
        : "FAIL — groups collection contract"
);
console.log(
    /groups\.push\s*\(\s*\{[\s\S]*?id:\s*doc\.id/.test(finalSource)
        ? "PASS — groups document output contract"
        : "FAIL — groups document output contract"
);
console.log(
    /return\s+groups\s*;?/.test(finalSource)
        ? "PASS — groups return contract"
        : "FAIL — groups return contract"
);
console.log(
    /group\s*=\s*\{[\s\S]*?id:\s*doc\.id[\s\S]*?\.\.\.data/.test(finalSource)
        ? "PASS — getById group construction contract"
        : "FAIL — getById group construction contract"
);
console.log(
    /return\s+group\s*;?/.test(finalSource)
        ? "PASS — getById group return contract"
        : "FAIL — getById group return contract"
);
console.log(
    syntax.status === 0
        ? "PASS — D34 gate module syntax"
        : "FAIL — D34 gate module syntax"
);

console.log("");
console.log("=== REPAIRED GATE SOURCE HASH ===");
console.log(hash);

console.log("");
console.log("===============================================");
console.log("RC406-D49 REPAIR COMPLETE");
console.log("===============================================");
