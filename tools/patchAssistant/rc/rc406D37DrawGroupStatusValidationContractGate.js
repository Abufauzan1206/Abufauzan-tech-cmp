import fs from "fs";
import { execSync } from "child_process";

const path = "js/services/drawGroupService.js";
const source = fs.readFileSync(path, "utf8");

let failed = false;

function check(name, pass) {
    if (pass) {
        console.log(`PASS — ${name}`);
    } else {
        console.log(`FAIL — ${name}`);
        failed = true;
    }
}

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D37 — DRAW GROUP STATUS VALIDATION CONTRACT GATE");
console.log("===============================================");

console.log("=== STATUS VALIDATION CONTRACT ===");

check(
    "updateGroupStatus function located",
    /export async function updateGroupStatus\s*\(/.test(source)
);

check(
    "updateGroupStatus accepts groupId and status",
    /updateGroupStatus\s*\(\s*groupId\s*,\s*status\s*\)/.test(source)
);

check(
    "status type validation exists",
    /typeof\s+status\s*!==\s*["']string["']/.test(source)
);

check(
    "empty status validation exists",
    /status\.trim\(\)\.length\s*===\s*0/.test(source)
);

check(
    "invalid status is rejected",
    /Invalid draw group status\./.test(source)
);

check(
    "validation occurs before updateDoc",
    (() => {
        const start = source.indexOf(
            "export async function updateGroupStatus"
        );
        const end = source.indexOf(
            "export ",
            start + 10
        );

        const block = source.slice(
            start,
            end === -1 ? source.length : end
        );

        const validationIndex =
            block.indexOf("typeof status");

        const updateIndex =
            block.indexOf("await updateDoc");

        return (
            validationIndex !== -1 &&
            updateIndex !== -1 &&
            validationIndex < updateIndex
        );
    })()
);

console.log("=== EXISTING AUTHORIZATION CONTRACT ===");

check(
    "super admin authorization preserved",
    /profile\.role\s*!==\s*["']super_admin["']/.test(source)
);

check(
    "cooperative admin authorization preserved",
    /profile\.role\s*!==\s*["']cooperative_admin["']/.test(source)
);

console.log("=== OWNERSHIP CONTRACT ===");

check(
    "cooperative ownership validation preserved",
    /groupData\.cooperativeId\s*!==\s*profile\.cooperativeId/.test(source)
);

console.log("=== FIRESTORE WRITE CONTRACT ===");

check(
    "updateDoc remains present",
    /await updateDoc\s*\(/.test(source)
);

check(
    "status remains persisted",
    /\{\s*status\s*\}/.test(source)
);

console.log("=== REQUIRED EXPORTS ===");

for (const name of [
    "createDrawGroup",
    "getDrawGroups",
    "getDrawGroupById",
    "updateGroupStatus"
]) {
    check(
        name,
        new RegExp(`export async function ${name}\\s*\\(`).test(source)
    );
}

console.log("=== NODE SYNTAX ===");

try {
    execSync(`node --check ${path}`, {
        stdio: "ignore"
    });

    check("module syntax", true);
} catch {
    check("module syntax", false);
}

const hash = execSync(
    `sha256sum ${path}`
).toString().trim().split(/\s+/)[0];

console.log("=== PRODUCTION SOURCE HASH ===");
console.log(hash);

console.log("===============================================");

if (failed) {
    console.log("RC406-D37 RESULT: FAIL");
    console.log("===============================================");
    process.exitCode = 1;
} else {
    console.log("RC406-D37 RESULT: PASS");
    console.log("===============================================");
    console.log("RC406-D37 COMPLETE");
}
