/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: journalPostingEngine.js
 * Version: 2.0.0
 *
 * Automatic Journal Posting Engine
 * =====================================================
 */

import {
    createJournal
} from "../services/journalService.js";

import {
    postLedgerBatch
} from "./ledgerBatchPostingEngine.js";

import {
    getNextSequence
} from "../services/counterService.js";

import {
    generateDocumentNumber
} from "../utils/generator.js";


export async function postJournal(data) {

    if (!data.title) {
        throw new Error("Journal title is required.");
    }

    if (data.debit == null || data.credit == null) {
        throw new Error("Debit and Credit are required.");
    }

    if (Number(data.debit) !== Number(data.credit)) {
        throw new Error("Journal is not balanced.");
    }

    const sequence =
        await getNextSequence("JRN");

    const journalNumber =
        generateDocumentNumber("JRN", sequence);

    const journal = {
        ...data,
        journalNumber,
        status: "POSTED",
        createdAt: new Date().toISOString()
    };

    const journalResult =
        await createJournal(journal);

    const ledgerResult =
        await postLedgerBatch([
            {
                account: data.debitAccount ?? "Cash Account",
                debit: data.debit,
                credit: 0
            },
            {
                account: data.creditAccount ?? "General Income",
                debit: 0,
                credit: data.credit
            }
        ], data.createdBy ?? "CMP");

    return {
        success: true,
        journalNumber,
        ledgerBatchNumber: ledgerResult.batchNumber,
        documentId: journalResult.id ?? journalResult,
        message: "Journal posted successfully."
    };

}
