/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC113 - FIX RC105 SYNTAX
 * =====================================================
 *
 * Repairs escaped backticks introduced into RC105.
 * Target file is modified ONLY through Patch Engine.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const BACKSLASH = String.fromCharCode(92);
const BACKTICK = String.fromCharCode(96);

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: BACKSLASH + BACKTICK,
        replace: BACKTICK
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC113 - FIX RC105 SYNTAX");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC113 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC113 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC113 PATCH COMPLETE");
    console.log("=========================================");
}

run();
