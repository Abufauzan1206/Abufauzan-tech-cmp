/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #014C
 *
 * File: rc014CTestRepairPatch.js
 * Version: 1.0.0
 *
 * Repair RC014C Sandbox Journal Test
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const TARGET_FILE =
    "testSandboxAwareJournalRC014C.html";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC014C TEST REPAIR"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: TARGET_FILE,

            search: `print("\\nSandbox Started: PASS");
        const result =
            await postJournal({

                title:
                    "RC014C Sandbox Journal",

print("\\nSandbox Started: PASS");

print("About to call postJournal...");

const result =
    await postJournal({`,

            replace: `print("\\nSandbox Started: PASS");

        print("About to call postJournal...");

        const result =
            await postJournal({

                title:
                    "RC014C Sandbox Journal",`

        });
        console.log(
            "PATCH: PASS"
        );

    }

    catch (error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}

run();
