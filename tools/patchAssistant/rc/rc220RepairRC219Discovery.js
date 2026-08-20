/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC220 — REPAIR RC219 DISCOVERY
 *
 * Purpose:
 * Prevent RC219 from selecting Patch Engine files,
 * including itself, as the RC190 test target.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js",
        mode: "regex",
        search:
            `const candidates = walk\\(ROOT\\)\\.filter\\(file => \\{\\s*const source = fs\\.readFileSync\\(file, "utf8"\\);\\s*return \\(\\s*source\\.includes\\("RC190 MEMBER REGISTRATION END-TO-END"\\) \\|\\|\\s*source\\.includes\\('fullName: "RC190 Test Member"'\\) \\|\\|\\s*source\\.includes\\('phoneNumber: "08000000190"'\\)\\s*\\);\\s*\\}\\);`,
        replace:
`const candidates = walk(ROOT).filter(file => {
    const relative = path.relative(ROOT, file);

    /*
     * Patch Engine infrastructure must never be considered
     * an RC190/member test target.
     */
    if (
        relative.startsWith("tools/patchAssistant/") ||
        relative === "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js"
    ) {
        return false;
    }

    const source = fs.readFileSync(file, "utf8");

    return (
        source.includes("RC190 MEMBER REGISTRATION END-TO-END") ||
        source.includes('fullName: "RC190 Test Member"') ||
        source.includes('phoneNumber: "08000000190"')
    );
});`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC220 — REPAIR RC219 DISCOVERY");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log("RC220 REPAIR RC219 DISCOVERY: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC220 REPAIR RC219 DISCOVERY: PASS");
}

console.log("==================================================");
