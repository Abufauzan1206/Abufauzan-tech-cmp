/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC115 - FIX RC105 TEMPLATE DELIMITERS
 * =====================================================
 *
 * Removes the unwanted backslash immediately before
 * template-literal delimiters inside RC105.
 *
 * RC105 remains the only target file.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const BS = String.fromCharCode(92);
const BT = String.fromCharCode(96);

/*
 * Match a literal backslash followed by a backtick.
 * Both characters are constructed without writing the
 * problematic sequence directly into this source file.
 */
const escapedBacktick = BS + BT;

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: escapedBacktick,
        replace: BT
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC115 - FIX RC105 TEMPLATE DELIMITERS");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC115 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC115 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC115 PATCH COMPLETE");
    console.log("=========================================");
}

run();
