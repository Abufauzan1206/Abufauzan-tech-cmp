/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC017A - Ledger Duplicate Protection Patch
 *
 * Ledger Integrity Hardening
 * =====================================================
 */

import {
    patch
} from "../patchEngine.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC017A - LEDGER DUPLICATE PROTECTION PATCH"
    );

    console.log(
        "========================================="
    );


    try {

        const servicePatch =
        await patch({

            path:
                "js/services/ledgerBatchService.js",

            search:
`export async function deleteLedgerBatch(id) {
    return await ledgerBatchRepository.delete(id);
}`,

            replace:
`export async function deleteLedgerBatch(id) {
    return await ledgerBatchRepository.delete(id);
}


export async function findLedgerBatchByJournalReference(reference) {

    const batches =
        await ledgerBatchRepository.findAll();


    return batches.find(

        batch =>
            batch.journalReference === reference

    ) || null;

}`
        });


        console.log(
            "SERVICE PATCH: PASS"
        );


        console.log(
            JSON.stringify(
                servicePatch,
                null,
                4
            )
        );
        const enginePatch =
        await patch({

            path:
                "js/business/ledgerBatchPostingEngine.js",

            search:
`import {
    createLedgerBatch
} from "../services/ledgerBatchService.js";`,

            replace:
`import {
    createLedgerBatch,
    findLedgerBatchByJournalReference
} from "../services/ledgerBatchService.js";`

        });


        console.log(
            "IMPORT PATCH: PASS"
        );


        console.log(
            JSON.stringify(
                enginePatch,
                null,
                4
            )
        );


        const logicPatch =
        await patch({

            path:
                "js/business/ledgerBatchPostingEngine.js",

            search:
`    const sequence =
        await getNextSequence("LED");`,

            replace:
`    if (options.journalReference) {

        const existing =
            await findLedgerBatchByJournalReference(
                options.journalReference
            );


        if (existing) {

            throw new Error(
                "Duplicate ledger batch detected."
            );

        }

    }


    const sequence =
        await getNextSequence("LED");`

        });


        console.log(
            "DUPLICATE CHECK PATCH: PASS"
        );


        console.log(
            JSON.stringify(
                logicPatch,
                null,
                4
            )
        );
        const journalPatch =
        await patch({

            path:
                "js/business/journalPostingEngine.js",

            search:
`    const ledgerResult =
        await postLedgerBatch(
            entries,

            data.createdBy ??
            "CMP",

            {
                sandboxId:
                    sandbox?.sandboxId
            }
        );`,

            replace:
`    const ledgerResult =
        await postLedgerBatch(
            entries,

            data.createdBy ??
            "CMP",

            {
                sandboxId:
                    sandbox?.sandboxId,

                journalReference:
                    data.reference,

                journalNumber

            }
        );`

        });


        console.log(
            "JOURNAL TRACE PATCH: PASS"
        );


        console.log(
            JSON.stringify(
                journalPatch,
                null,
                4
            )
        );


        console.log(
            "========================================="
        );

        console.log(
            "RC017A PATCH COMPLETE"
        );

        console.log(
            "========================================="
        );


    }
    catch(error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}


run();
