/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC131B - REPAIR COOPERATIVE ADMIN ROLE ASSERTION
 *
 * Purpose:
 * Repair the RC131A assertion without changing the
 * Cooperative Admin authorization implementation.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testLogoutSessionTerminationIntegration.js",
        mode: "regex",
        search: `assert\\(\\s*/rolesMatch\\\\?\\(\\[\\\\s\\\\S\\]\\*?\\)\\/s\\.test\\(cooperativeAdminSource\\),\\s*"Cooperative Admin dashboard validates canonical Cooperative Admin role"\\s*\\);`,
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
    console.log("RC131B - REPAIR COOPERATIVE ADMIN ROLE ASSERTION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC131B TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC131B PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC131B PATCH COMPLETE");
    console.log("=========================================");
}

run();
