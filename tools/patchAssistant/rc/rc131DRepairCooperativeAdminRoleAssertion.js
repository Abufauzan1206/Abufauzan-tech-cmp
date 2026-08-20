/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC131D - ROBUST COOPERATIVE ADMIN ASSERTION REPAIR
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testLogoutSessionTerminationIntegration.js",
        mode: "regex",
        search: `assert\\(\\s*\\/rolesMatch[\\s\\S]*?"Cooperative Admin dashboard validates canonical Cooperative Admin role"\\s*\\);`,
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
    console.log("RC131D - ROBUST COOPERATIVE ADMIN ASSERTION REPAIR");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC131D TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC131D PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC131D PATCH COMPLETE");
    console.log("=========================================");
}

run();
