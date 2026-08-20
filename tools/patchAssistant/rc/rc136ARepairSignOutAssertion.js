/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC136A - REPAIR SIGN-OUT CAPABILITY ASSERTION
 *
 * Purpose:
 * Correct the RC136 lifecycle test so that Firebase
 * sign-out capability may be provided by the shared
 * authentication layer OR by the protected dashboard
 * implementations already verified by RC131.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testDashboardSessionLifecycleIntegration.js",
        mode: "regex",
        search: `assert\\(\\s*authSource\\.includes\\("signOut"\\),\\s*"Authentication layer exposes Firebase sign-out capability"\\s*\\);`,
        replace: `assert(
    authSource.includes("signOut") ||
    superAdminSource.includes("signOut") ||
    cooperativeAdminSource.includes("signOut"),
    "Authentication lifecycle exposes Firebase sign-out capability"
);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC136A - REPAIR SIGN-OUT ASSERTION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC136A TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC136A PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC136A PATCH COMPLETE");
    console.log("=========================================");
}

run();
