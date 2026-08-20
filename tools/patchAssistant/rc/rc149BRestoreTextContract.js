/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC149B - RESTORE RC149 TEXT CONTRACT
 *
 * Purpose:
 * Restore RC149 to the established Patch Engine
 * contract because its test target already exists.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc149ProtectedDashboardAuthorizationPersistence.js",
        mode: "text",
        search: `        mode: "create",
        search: "",
        replace: \``,
        replace: `        mode: "text",`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC149B - RESTORE RC149 TEXT CONTRACT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC149B TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC149B PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC149B PATCH COMPLETE");
    console.log("=========================================");

    console.log("Running RC149...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const result149 = spawnSync(
        "node",
        [
            "tools/patchAssistant/rc/rc149ProtectedDashboardAuthorizationPersistence.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = result149.status ?? 1;
}

run();
