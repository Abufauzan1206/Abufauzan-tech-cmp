/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: journalPostingEngine.js
 * Version: 3.1.0
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
        throw new Error(
            "Journal title is required."
        );
    }

    if (
        data.debit == null ||
        data.credit == null
    ) {
        throw new Error(
            "Debit and Credit are required."
        );
    }

    if (
        Number(data.debit) !==
        Number(data.credit)
    ) {
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


    const debitAccount =
        await getAccountByName(
            data.debitAccount
        );

    if (!debitAccount) {

        throw new Error(
            `Debit account not found: ${data.debitAccount}`
        );

    }

    const creditAccount =
        await getAccountByName(
            data.creditAccount
        );

    if (!creditAccount) {

        throw new Error(
            `Credit account not found: ${data.creditAccount}`
        );

    }

    const journal = {

        ...data,

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
            [
                {
                    account:
                        data.debitAccount ??
                        "Cash Account",

                    debit:
                        data.debit,

                    credit: 0
                },

                {
                    account:
                        data.creditAccount ??
                        "General Income",

                    debit: 0,

                    credit:
                        data.credit
                }

            ],

            data.createdBy ??
            "CMP"
        );


    return {

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

    };

}
