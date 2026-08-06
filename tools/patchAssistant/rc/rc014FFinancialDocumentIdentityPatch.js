/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #014F
 *
 * File: rc014FFinancialDocumentIdentityPatch.js
 * Version: 1.0.0
 *
 * Financial Document Identity Enhancement
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
        "RC014F - FINANCIAL DOCUMENT IDENTITY"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: TARGET_FILE,

            search: `return {

        success: true,

        journalNumber,

        ledgerBatchNumber:
            ledgerResult.batchNumber,

        documentId:
            journalResult.id ??
            journalResult,

        accountingPeriod:
            period.name,

        message:
            "Journal posted successfully."

    };`,

            replace: `return {

        success: true,

        journalDocumentId:
            journalResult.id ??
            journalResult,

        ledgerDocumentId:
            ledgerResult.documentId ??
            ledgerResult,

        journalNumber,

        ledgerBatchNumber:
            ledgerResult.batchNumber,

        accountingPeriod:
            period.name,

        message:
            "Journal posted successfully."

    };`

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
