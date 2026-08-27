import fs from "fs/promises";
import crypto from "crypto";
import { spawnSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D36 — DRAW GROUP STATUS TRANSITION CONTRACT GATE");
console.log("===============================================");

let failed = false;

function check(name, pass) {
    console.log(`${pass ? "PASS" : "FAIL"} — ${name}`);
    if (!pass) failed = true;
}

const statusStart =
    source.indexOf("export async function updateGroupStatus");

const statusSource =
    statusStart >= 0
        ? source.slice(statusStart)
        : "";

console.log("");
console.log("=== STATUS UPDATE CONTRACT ===");

check(
    "updateGroupStatus function located",
    statusSource.length > 0
);

check(
    "updateGroupStatus accepts groupId and status",
    /updateGroupStatus\s*\(\s*groupId\s*,\s*status\s*\)/.test(
        statusSource
    )
);

check(
    "updateGroupStatus validates current user profile",
    /getCurrentUserProfile\(\)/.test(statusSource)
);

check(
    "updateGroupStatus references cooperative ownership",
    /cooperativeId/.test(statusSource)
);

check(
    "updateGroupStatus supports cooperative admin authorization",
    /cooperative_admin/.test(statusSource)
);

check(
    "updateGroupStatus supports super admin authorization",
    /super_admin/.test(statusSource)
);

check(
    "updateGroupStatus accesses requested group",
    /groupId/.test(statusSource)
);

check(
    "updateGroupStatus persists status with updateDoc",
    /await\s+updateDoc\s*\(/.test(statusSource)
);

check(
    "updateGroupStatus writes status field",
    /(?:status\s*:|\bstatus\b\s*\n?\s*})/.test(statusSource)
);

check(
    "updateGroupStatus rejects unauthorized access",
    /Unauthorized|unauthorized|Forbidden|forbidden/.test(
        statusSource
    )
);

console.log("");
console.log("=== REQUIRED EXPORTS ===");

for (const name of [
    "createDrawGroup",
    "getDrawGroups",
    "getDrawGroupById",
    "updateGroupStatus"
]) {
    check(
        name,
        new RegExp(
            `export async function ${name}\\s*\\(`
        ).test(source)
    );
}

console.log("");
console.log("=== NODE SYNTAX ===");

const syntax = spawnSync(
    process.execPath,
    ["--check", path],
    {
        encoding: "utf8"
    }
);

check(
    "module syntax",
    syntax.status === 0
);

if (syntax.stdout) {
    console.log(syntax.stdout);
}

if (syntax.stderr) {
    console.log(syntax.stderr);
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
    console.log("RC406-D36 RESULT: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC406-D36 RESULT: PASS");
}

console.log("===============================================");
console.log("RC406-D36 COMPLETE");
console.log("===============================================");
