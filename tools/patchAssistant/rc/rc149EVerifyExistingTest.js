/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC149E - VERIFY EXISTING RC149 TEST
 *
 * Purpose:
 * RC149 test target already exists. Verify that existing
 * test directly instead of attempting a duplicate create.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC149E - VERIFY EXISTING RC149 TEST");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC149E TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC149E PATCH ENGINE FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC149E PATCH ENGINE CHECK COMPLETE");
    console.log("=========================================");

    console.log("Running existing RC149 test...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testProtectedDashboardAuthorizationPersistence.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
