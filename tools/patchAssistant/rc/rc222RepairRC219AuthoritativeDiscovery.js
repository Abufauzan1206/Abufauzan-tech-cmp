/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC222 — REPAIR RC219 AUTHORITATIVE DISCOVERY
 *
 * Purpose:
 * Align RC219 target discovery with RC201, which is now
 * the authoritative member-registration persistence
 * verification.
 *
 * RC219 must:
 *   - exclude Patch Engine infrastructure
 *   - exclude itself
 *   - locate RC201 by its canonical memberService contract
 *   - reject ambiguous targets
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
     * Never inspect Patch Engine infrastructure itself.
     * RC219 must discover the authoritative member
     * persistence verification source.
     */
    if (
        relative.startsWith("tools/patchAssistant/") ||
        relative === "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js"
    ) {
        return false;
    }

    const source = fs.readFileSync(file, "utf8");

    /*
     * RC201 is authoritative.
     *
     * Identify the source by its canonical memberService
     * contract rather than obsolete RC190 test markers.
     */
    return (
        source.includes('from "../../../js/services/memberService.js";') &&
        source.includes("registerMember") &&
        source.includes("getMemberById") &&
        source.includes("deleteMember") &&
        source.includes("RC201 — MEMBER REGISTRATION PERSISTENCE")
    );
});`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC222 — REPAIR RC219 AUTHORITATIVE DISCOVERY");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log("RC222 REPAIR RC219 AUTHORITATIVE DISCOVERY: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC222 REPAIR RC219 AUTHORITATIVE DISCOVERY: PASS");
}

console.log("==================================================");
