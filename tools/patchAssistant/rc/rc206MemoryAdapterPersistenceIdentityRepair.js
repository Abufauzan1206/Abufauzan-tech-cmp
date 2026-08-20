/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC206 — MEMORY ADAPTER PERSISTENCE IDENTITY REPAIR
 *
 * Purpose:
 * Make the Node.js memory adapter preserve an explicit
 * record identity (memberId) as the persisted record id,
 * while retaining UUID generation for generic records.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/adapters/memoryAdapter.js",
        mode: "regex",

        search: /        const item = \{\s*id:\s*crypto\.randomUUID\(\),\s*\.\.\.record\s*\};/s,

        replace: `        const item = {
            id:
                record?.id ??
                record?.memberId ??
                crypto.randomUUID(),
            ...record
        };`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC206 — MEMORY ADAPTER PERSISTENCE IDENTITY REPAIR");
console.log("==================================================");

console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("==================================================");
console.log(
    result.success
        ? "RC206 MEMORY ADAPTER PERSISTENCE IDENTITY: PASS"
        : "RC206 MEMORY ADAPTER PERSISTENCE IDENTITY: FAIL"
);
console.log("==================================================");
