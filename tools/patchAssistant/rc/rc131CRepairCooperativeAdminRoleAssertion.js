/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC131C - EXACT REPAIR OF COOPERATIVE ADMIN ASSERTION
 *
 * Purpose:
 * 1. Remove the invalid RC131A regex literal.
 * 2. Verify the Cooperative Admin role contract safely.
 * 3. Preserve the production authorization implementation.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testLogoutSessionTerminationIntegration.js",
        mode: "regex",
        search: `/assert\\(\\s*\\/rolesMatch\\\\\\(\\s*\\\\s\\*userData\\\\\\.role,\\\\s\\*\\s*"cooperative_admin"\\s*\\\\s\\*\\\\\\/s\\.test\\(cooperativeAdminSource\\),\\s*"Cooperative Admin dashboard validates canonical Cooperative Admin role"\\s*\\);/`,
        replace: `assert(
    cooperativeAdminSource.includes("rolesMatch") &&
    cooperativeAdminSource.includes("userData.role") &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin dashboard validates canonical Cooperative Admin role"
);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC131C - EXACT COOPERATIVE ADMIN ASSERTION REPAIR");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC131C TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC131C PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC131C PATCH COMPLETE");
    console.log("=========================================");
}

run();
