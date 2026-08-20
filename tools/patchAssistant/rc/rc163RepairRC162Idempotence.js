/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC163 - REPAIR RC162 IDEMPOTENCE
 *
 * Purpose:
 * 1. Update obsolete RC162 search contracts.
 * 2. Align RC162 with the current RC130 canonical
 *    role authorization contract.
 * 3. Preserve Patch Engine workflow.
 * 4. Make RC162 safe to rerun after RC130 is already
 *    correctly upgraded.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc162FixRC130LoginRoutingTest.js",
        mode: "regex",
        search: String.raw`const patches = \[[\s\S]*?\n\];`,
        replace: `const patches = [
    {
        path: "tools/patchAssistant/test/testLoginRoutingIntegration.js",
        mode: "exact",
        search: \`assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"super_admin"'),
    "auth.js uses canonical Super Admin role authorization"
);\`,
        replace: \`assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"super_admin"'),
    "auth.js uses canonical Super Admin role authorization"
);\`
    },
    {
        path: "tools/patchAssistant/test/testLoginRoutingIntegration.js",
        mode: "exact",
        search: \`assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"cooperative_admin"'),
    "auth.js uses canonical Cooperative Admin role authorization"
);\`,
        replace: \`assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"cooperative_admin"'),
    "auth.js uses canonical Cooperative Admin role authorization"
);\`
    }
];`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC163 - REPAIR RC162 IDEMPOTENCE");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC163 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC163 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC163 PATCH COMPLETE");
    console.log("=========================================");
}

run();
