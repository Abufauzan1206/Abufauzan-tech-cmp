/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC224 — REPAIR RC219 RC201 BOUNDARY
 *
 * Purpose:
 * Permit the single authoritative RC201 verification
 * target through RC219 discovery while continuing to
 * exclude all other Patch Engine infrastructure.
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
            `if \\(\\s*relative\\.startsWith\\("tools/patchAssistant/"\\)\\s*\\) \\{\\s*return false;\\s*\\}`,
        replace:
            `if (
        relative.startsWith("tools/patchAssistant/") &&
        relative !==
            "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js"
    ) {
        return false;
    }`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC224 — REPAIR RC219 RC201 BOUNDARY");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log("RC224 REPAIR RC219 RC201 BOUNDARY: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC224 REPAIR RC219 RC201 BOUNDARY: PASS");
}

console.log("==================================================");
