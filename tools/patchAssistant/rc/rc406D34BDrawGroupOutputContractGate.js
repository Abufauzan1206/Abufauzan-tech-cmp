import fs from "fs/promises";
import crypto from "crypto";
import { spawnSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D34B — DRAW GROUP OUTPUT CONTRACT GATE");
console.log("===============================================");

let failed = false;

function section(name) {
    console.log("");
    console.log(`=== ${name} ===`);
}

function check(name, pass) {
    console.log(`${pass ? "PASS" : "FAIL"} — ${name}`);
    if (!pass) {
        failed = true;
    }
}

section("CREATE OUTPUT CONTRACT");

check(
    "createDrawGroup returns Firestore document id",
    /return\s+docRef\.id\s*;?/.test(source)
);

section("LIST OUTPUT CONTRACT");

const listStart = source.indexOf(
    "export async function getDrawGroups"
);

const listEnd = source.indexOf(
    "export async function getDrawGroupById",
    listStart
);

const listSource =
    listStart >= 0 && listEnd > listStart
        ? source.slice(listStart, listEnd)
        : "";

check(
    "getDrawGroups function located",
    listSource.length > 0
);

check(
    "getDrawGroups creates result collection",
    /const\s+groups\s*=\s*\[\s*\]/.test(listSource)
);

check(
    "getDrawGroups iterates Firestore snapshot",
    /snapshot\.forEach\s*\(/.test(listSource)
);

check(
    "getDrawGroups pushes document id",
    /groups\.push\s*\(\s*\{[\s\S]*?id:\s*doc\.id/.test(listSource)
);

check(
    "getDrawGroups includes document data",
    /groups\.push\s*\(\s*\{[\s\S]*?\.\.\.data/.test(listSource)
);

check(
    "getDrawGroups returns groups array",
    /return\s+groups\s*;/.test(listSource)
);

section("GET-BY-ID OUTPUT CONTRACT");

const getByIdStart = source.indexOf(
    "export async function getDrawGroupById"
);

const getByIdEnd = source.indexOf(
    "export async function updateGroupStatus",
    getByIdStart
);

const getByIdSource =
    getByIdStart >= 0 && getByIdEnd > getByIdStart
        ? source.slice(getByIdStart, getByIdEnd)
        : "";

check(
    "getDrawGroupById function located",
    getByIdSource.length > 0
);

check(
    "getDrawGroupById accepts groupId",
    /getDrawGroupById\s*\(\s*groupId\s*\)/.test(getByIdSource)
);

check(
    "getDrawGroupById reads Firestore",
    /await\s+getDocs\s*\(/.test(getByIdSource)
);

check(
    "getDrawGroupById matches requested document id",
    /doc\.id\s*===\s*groupId/.test(getByIdSource)
);

check(
    "getDrawGroupById constructs returned group object",
    /group\s*=\s*\{[\s\S]*?id:\s*doc\.id[\s\S]*?\.\.\.data[\s\S]*?\}/.test(
        getByIdSource
    )
);

check(
    "getDrawGroupById returns group",
    /return\s+group\s*;/.test(getByIdSource)
);

check(
    "getDrawGroupById handles absent group",
    /group\s*===\s*null|if\s*\(\s*!group\s*\)|Draw group not found/.test(
        getByIdSource
    )
);

section("STATUS UPDATE OUTPUT CONTRACT");

const statusStart = source.indexOf(
    "export async function updateGroupStatus"
);

const statusSource =
    statusStart >= 0
        ? source.slice(statusStart)
        : "";

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
    "updateGroupStatus persists status",
    /await\s+updateDoc\s*\(/.test(statusSource)
);

section("REQUIRED EXPORTS");

const requiredExports = [
    "createDrawGroup",
    "getDrawGroups",
    "getDrawGroupById",
    "updateGroupStatus"
];

for (const name of requiredExports) {
    check(
        name,
        new RegExp(
            `export async function ${name}\\s*\\(`
        ).test(source)
    );
}

section("NODE SYNTAX");

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

section("PRODUCTION SOURCE HASH");

const hash = crypto
    .createHash("sha256")
    .update(source)
    .digest("hex");

console.log(hash);

console.log("");
console.log("===============================================");

if (failed) {
    console.log("RC406-D34B RESULT: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC406-D34B RESULT: PASS");
}

console.log("===============================================");
console.log("RC406-D34B COMPLETE");
console.log("===============================================");
