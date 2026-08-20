/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC140B - RESTORE RC140 CREATE CONTRACT
 *
 * Purpose:
 * Restore the RC140 history-guard patch definition
 * to the established Patch Engine create contract.
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
        search: '        mode: "text",\n        replace: `',
        replace: '        mode: "create",\n        search: "",\n        replace: `'
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC140B - RESTORE RC140 CREATE CONTRACT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC140B TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC140B PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC140B PATCH COMPLETE");
    console.log("=========================================");
}

run();
