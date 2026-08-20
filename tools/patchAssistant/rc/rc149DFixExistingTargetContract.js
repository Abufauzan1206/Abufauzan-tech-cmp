/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC149D - FIX EXISTING TARGET CONTRACT
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc149ProtectedDashboardAuthorizationPersistence.js",
        mode: "text",
        search: `mode: "create",`,
        replace: `mode: "text",`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC149D - FIX EXISTING TARGET CONTRACT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC149D TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC149D PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC149D PATCH COMPLETE");
    console.log("=========================================");

    console.log("Running RC149...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/rc/rc149ProtectedDashboardAuthorizationPersistence.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
