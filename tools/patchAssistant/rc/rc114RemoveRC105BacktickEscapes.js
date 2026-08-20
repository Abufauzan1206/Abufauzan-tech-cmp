/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC114 - REMOVE RC105 BACKTICK ESCAPES
 * =====================================================
 *
 * Removes one or more backslashes immediately before
 * JavaScript template-literal backticks in RC105.
 *
 * Target test is NOT modified.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const BACKSLASH = String.fromCharCode(92);
const BACKTICK = String.fromCharCode(96);

/*
 * Regex represented without literal backticks:
 *
 * \\+`
 *
 * Meaning:
 * one or more backslashes followed by a backtick.
 */
const escapedBacktickRegex =
    BACKSLASH + BACKSLASH + "+" + BACKTICK;

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: escapedBacktickRegex,
        replace: BACKTICK
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC114 - REMOVE RC105 BACKTICK ESCAPES");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC114 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC114 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC114 PATCH COMPLETE");
    console.log("=========================================");
}

run();
