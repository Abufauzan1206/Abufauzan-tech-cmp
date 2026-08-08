/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: ledgerBatchPostingEngine.js
 * Version: 1.0.0
 *
 * Ledger Batch Posting Engine
 * =====================================================
 */

import {
    createLedgerBatch,
    findLedgerBatchByJournalReference
} from "../services/ledgerBatchService.js";

import {
    getNextSequence
} from "../services/counterService.js";

import {
    generateDocumentNumber
} from "../utils/generator.js";


export async function postLedgerBatch(

    entries,

    createdBy = "CMP",

    options = {}

) {

    if (!Array.isArray(entries) || entries.length === 0) {
        throw new Error("Ledger batch must contain at least one entry.");
    }

    let totalDebit = 0;
    let totalCredit = 0;

    for (const entry of entries) {

        totalDebit += Number(entry.debit || 0);
        totalCredit += Number(entry.credit || 0);

    }

    if (totalDebit !== totalCredit) {
        throw new Error(
            "Ledger batch is not balanced."
        );
    }

    if (options.journalReference) {

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
        await getNextSequence("LED");

    const batchNumber =
        generateDocumentNumber("LED", sequence);

    const batch = {
        batchNumber,
        entries,

        ...(options.journalReference
            ? {
                journalReference:
                    options.journalReference
            }
            : {}),

        ...(options.sandboxId
            ? {
                sandboxId:
                    options.sandboxId
            }
            : {}),

        totalDebit,
        totalCredit,
        createdBy,
        status: "POSTED",
        createdAt: new Date().toISOString()
    };

    const result =
        await createLedgerBatch(batch);

    return {
        success: true,
        batchNumber,
        documentId: result.id ?? result,
        totalEntries: entries.length,
        totalDebit,
        totalCredit
    };

}
