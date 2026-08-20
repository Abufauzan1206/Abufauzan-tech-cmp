/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC140A - REPAIR RC140 PATCH DEFINITION
 *
 * Purpose:
 * Correct the RC140 Patch Engine transaction so that
 * the test file is created using the supported
 * replacement contract.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc140ProtectedDashboardHistoryGuard.js",
        mode: "text",
        search: '        mode: "create",',
        replace: '        mode: "text",'
    },
    {
        path: "tools/patchAssistant/rc/rc140ProtectedDashboardHistoryGuard.js",
        mode: "text",
        search: '        content: `',
        replace: '        replace: `'
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC140A - REPAIR RC140 PATCH DEFINITION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC140A TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC140A PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC140A PATCH COMPLETE");
    console.log("=========================================");
}

run();
