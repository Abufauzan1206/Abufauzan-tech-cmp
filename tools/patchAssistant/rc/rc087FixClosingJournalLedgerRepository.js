/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #087
 *
 * Fix Closing Journal Posting Integration Test
 * to inspect the Ledger Batch repository.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path:
            "testClosingJournalPostingIntegration.js",

        mode:
            "exact",

        search:
`    const ledgerRepository =
        CMPRepositoryManager.get("ledger");

    const ledgerBatches =
        await ledgerRepository.findAll();`,

        replace:
`    const ledgerBatchRepository =
        CMPRepositoryManager.get("ledgerBatch");

    const ledgerBatches =
        await ledgerBatchRepository.findAll();`
    }

];

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC087 - FIX CLOSING JOURNAL LEDGER BATCH TEST"
    );

    console.log(
        "========================================="
    );

    const result =
        await transaction(patches);

    console.log(
        "RC087 TRANSACTION RESULT:"
    );

    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {

        process.exitCode = 1;

        console.log(
            "========================================="
        );

        console.log(
            "RC087 PATCH FAIL"
        );

        console.log(
            "========================================="
        );

        return;

    }

    console.log(
        "========================================="
    );

    console.log(
        "RC087 PATCH COMPLETE"
    );

    console.log(
        "========================================="
    );

}

run();
