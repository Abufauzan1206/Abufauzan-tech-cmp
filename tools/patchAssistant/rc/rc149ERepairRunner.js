/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC149E - REPAIR EXISTING TEST RUNNER
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc149EVerifyExistingTest.js",
        mode: "text",
        search: `RC149E - VERIFY EXISTING RC149 TEST`,
        replace: `RC149E - VERIFY EXISTING RC149 TEST`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC149E - REPAIR EXISTING TEST RUNNER");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC149E TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC149E PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC149E PATCH COMPLETE");
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
