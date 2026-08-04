/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC003 - Ledger Integrity Validation
 *
 * Version: 1.0.0
 * =====================================================
 */

import {
    getAllLedgerBatches
} from "../../../js/services/ledgerBatchService.js";


async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC003 - LEDGER INTEGRITY TEST");
    console.log("=========================================");

    try {

        const batches =
            await getAllLedgerBatches();


        if (!batches || batches.length === 0) {

            throw new Error(
                "No ledger batches found."
            );

        }


        const latest =
            batches[batches.length - 1];


        if (
            latest.totalDebit !==
            latest.totalCredit
        ) {

            throw new Error(
                "Ledger batch is not balanced."
            );

        }


        console.log(
            "LEDGER INTEGRITY: PASS"
        );


        console.log(
            JSON.stringify(
                latest,
                null,
                4
            )
        );


    }
    catch(error) {

        console.log(
            "LEDGER INTEGRITY: FAIL"
        );

        console.log(
            error.message
        );

    }

}


run();
