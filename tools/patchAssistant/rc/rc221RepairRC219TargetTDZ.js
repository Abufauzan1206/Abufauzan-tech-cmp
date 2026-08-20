/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC221-A — REPAIR RC219 TARGET INITIALIZATION
 *
 * Purpose:
 * Repair RC219's target-reference TDZ error.
 *
 * RC219 must not reference `target` before it is
 * initialized. Discovery filtering must use the
 * literal infrastructure path at this stage.
 *
 * MUST execute through Patch Engine.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const target =
    "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js";

const patches = [
    {
        path: target,
        mode: "regex",
        search:
            `relative === target`,
        replace:
            `relative === "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js"`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC221-A — REPAIR RC219 TARGET INITIALIZATION");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log("RC221-A REPAIR RC219 TDZ: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC221-A REPAIR RC219 TDZ: PASS");
}

console.log("==================================================");
