/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC134A - FIX MENU DATA PATH
 *
 * Purpose:
 * Correct the RC134 navigation test to use the actual
 * navigation menu-data.js location.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardNavigationGuard.js",
        mode: "text",
        search: 'const menuSource = fs.readFileSync(\n    "js/menu-data.js",\n    "utf8"\n);',
        replace: 'const menuSource = fs.readFileSync(\n    "js/navigation/menu-data.js",\n    "utf8"\n);'
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC134A - FIX MENU DATA PATH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC134A TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC134A PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC134A PATCH COMPLETE");
    console.log("=========================================");
}

run();
