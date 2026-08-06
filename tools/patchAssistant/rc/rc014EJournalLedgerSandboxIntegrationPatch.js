/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #014E
 *
 * File: rc014EJournalLedgerSandboxIntegrationPatch.js
 * Version: 1.0.0
 *
 * Journal → Ledger Sandbox Integration
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const TARGET_FILE =
    "js/business/journalPostingEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC014E - JOURNAL LEDGER SANDBOX INTEGRATION"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: TARGET_FILE,

            search: `await postLedgerBatch(
            entries,

            data.createdBy ??
            "CMP"
        );`,

            replace: `await postLedgerBatch(
            entries,

            data.createdBy ??
            "CMP",

            {
                sandboxId:
                    sandbox?.sandboxId
            }
        );`

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
