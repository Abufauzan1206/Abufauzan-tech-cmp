/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC220 — REPAIR RC219 MEMBER TEST TARGET DISCOVERY
 *
 * Purpose:
 * Repair RC219 so Patch Engine target discovery cannot
 * select its own patch script.
 *
 * RC219 must:
 *   - exclude tools/patchAssistant/**
 *   - exclude itself
 *   - locate the real RC190 member test source
 *   - align MemoryAdapter with CMPMemoryAdapter
 *
 * =====================================================
 */

import fs from "fs";
import path from "path";
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
     * RC219 must discover the real member test source,
     * not another patch script containing RC190 strings.
     */
    if (
        relative.startsWith("tools/patchAssistant/") ||
        relative === target
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
console.log("RC220 — REPAIR RC219 MEMBER TEST TARGET DISCOVERY");
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
