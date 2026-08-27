/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC223 — REPAIR RC219 DETERMINISTIC TARGET DISCOVERY
 *
 * Purpose:
 * Make RC219 resolve the authoritative RC201 member
 * persistence verification deterministically.
 *
 * RC201 is authoritative and its exact repository path
 * is known. Discovery must not depend on fragile textual
 * RC201 heading matching.
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
            `const candidates = walk\\(ROOT\\)\\.filter\\(file => \\{[\\s\\S]*?\\n\\}\\);`,
        replace:
            `const candidates = walk(ROOT).filter(file => {
    const relative = path.relative(ROOT, file);

    /*
     * RC201 is the authoritative member-registration
     * persistence verification target.
     *
     * Patch Engine infrastructure is never a valid target.
     */
    if (relative.startsWith("tools/patchAssistant/")) {
        return false;
    }

    /*
     * Deterministic authoritative target.
     * Do not rely on obsolete RC190 markers or fragile
     * heading text.
     */
    if (
        relative ===
        "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js"
    ) {
        return true;
    }

    return false;
});`
    },
    {
        path: target,
        mode: "regex",
        search: `console\\.log\\("RC190 CANDIDATES:"\\);`,
        replace: `console.log("AUTHORITATIVE RC201 CANDIDATES:");`
    },
    {
        path: target,
        mode: "regex",
        search:
            `RC219 ERROR: Active RC190 test source could not be located\\.`,
        replace:
            `RC219 ERROR: Authoritative RC201 member test source could not be located.`
    },
    {
        path: target,
        mode: "regex",
        search:
            `RC219 ERROR: Multiple RC190 candidates found\\.`,
        replace:
            `RC219 ERROR: Multiple authoritative RC201 candidates found.`
    },
    {
        path: target,
        mode: "regex",
        search:
            `console\\.log\\("RC219 — LOCATE ACTIVE RC190 TEST TARGET"\\);`,
        replace:
            `console.log("RC219 — LOCATE AUTHORITATIVE RC201 MEMBER TEST TARGET");`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC223 — REPAIR RC219 DETERMINISTIC TARGET DISCOVERY");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log("RC223 REPAIR RC219 DETERMINISTIC DISCOVERY: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC223 REPAIR RC219 DETERMINISTIC DISCOVERY: PASS");
}

console.log("==================================================");
