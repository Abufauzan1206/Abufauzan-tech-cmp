/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC131A - FIX COOPERATIVE ADMIN ROLE ASSERTION
 *
 * Purpose:
 * 1. Correct the RC131 source-contract assertion.
 * 2. Accept formatted multiline rolesMatch().
 * 3. Preserve the existing authorization implementation.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testLogoutSessionTerminationIntegration.js",
        mode: "regex",
        search: `assert\\(\\s*cooperativeAdminSource\\.includes\\(\\s*'rolesMatch\\(userData\\.role, "cooperative_admin"\\)'\\s*\\),\\s*"Cooperative Admin dashboard validates canonical Cooperative Admin role"\\s*\\);`,
        replace: `assert(
    /rolesMatch\\(
\\s*userData\\.role,\\s*
"cooperative_admin"
\\s*\\)/s.test(cooperativeAdminSource),
    "Cooperative Admin dashboard validates canonical Cooperative Admin role"
);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC131A - FIX COOPERATIVE ADMIN ROLE ASSERTION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC131A TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC131A PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC131A PATCH COMPLETE");
    console.log("=========================================");
}

run();
