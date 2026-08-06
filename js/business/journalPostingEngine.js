/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: journalPostingEngine.js
 * Version: 4.0.0
 *
 * Automatic Journal Posting Engine
 * Date Aware Period Control
 * =====================================================
 */

import {
    createJournal
} from "../services/journalService.js";

import {
    getAccountingPeriodByDate
} from "../services/accountingPeriodService.js";

import {
    getAccountByName
} from "../services/chartOfAccountsService.js";

import {
    validateEntries
} from "../services/financialValidationService.js";

import {
    postLedgerBatch
} from "./ledgerBatchPostingEngine.js";

import {
    getNextSequence
} from "../services/counterService.js";

import {
    generateDocumentNumber
} from "../utils/generator.js";

import {
    isSandboxActive,
    getCurrentSandbox
} from "../utils/sandboxManager.js";


function normalizeJournalEntries(data) {

    if (data.entries &&
        Array.isArray(data.entries)) {

        return data.entries;

    }


    return [

        {
            account:
                data.debitAccount,

            debit:
                data.debit,

            credit:
                0
        },

        {
            account:
                data.creditAccount,

            debit:
                0,

            credit:
                data.credit
        }

    ];

}


export async function postJournal(data) {

    if (!data.title) {
        throw new Error(
            "Journal title is required."
        );
    }


    const entries =
        normalizeJournalEntries(data);


    await validateEntries(
        entries
    );

    if (
        !entries ||
        entries.length === 0
    ) {

        throw new Error(
            "Journal entries are required."
        );

    }


    const totalDebit =
        entries.reduce(
            (sum, entry) =>
                sum + Number(entry.debit || 0),
            0
        );


    const totalCredit =
        entries.reduce(
            (sum, entry) =>
                sum + Number(entry.credit || 0),
            0
        );


    if (totalDebit !== totalCredit) {

        throw new Error(
            "Journal is not balanced."
        );

    }


    if (!data.date) {
        throw new Error(
            "Journal date is required."
        );
    }


    const period =
        await getAccountingPeriodByDate(
            data.date
        );


    if (!period) {
        throw new Error(
            "No accounting period found for journal date."
        );
    }


    if (
        period.status !== "OPEN" ||
        period.locked === true
    ) {
        throw new Error(
            "Accounting period is closed or locked. Posting is blocked."
        );
    }


    const sequence =
        await getNextSequence("JRN");


    const journalNumber =
        generateDocumentNumber(
            "JRN",
            sequence
        );


    for (const entry of entries) {

        const account =
            await getAccountByName(
                entry.account
            );


        if (!account) {

            throw new Error(
                `Account not found: ${entry.account}`
            );

        }

    }

    const sandbox =
        isSandboxActive()
            ? getCurrentSandbox()
            : null;

    const journal = {

        ...data,

        ...(sandbox
            ? {
                sandboxId:
                    sandbox.sandboxId
            }
            : {}),

        accountingPeriod:
            period.name,

        journalNumber,

        status:
            "POSTED",

        createdAt:
            new Date().toISOString()

    };


    const journalResult =
        await createJournal(journal);


    const ledgerResult =
        await postLedgerBatch(
            entries,

            data.createdBy ??
            "CMP",

            {
                sandboxId:
                    sandbox?.sandboxId
            }
        );


    return {

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

    };

}
