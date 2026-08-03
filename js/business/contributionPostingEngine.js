/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: contributionPostingEngine.js
 * Version: 1.0.0
 *
 * Contribution Posting Engine
 * =====================================================
 */

import {
    createContribution
} from "../services/contributionService.js";

import {
    createTransaction
} from "../services/transactionService.js";

import {
    postJournal
} from "./journalPostingEngine.js";

import {
    postLedger
} from "./ledgerPostingEngine.js";

import {
    getNextSequence
} from "../services/counterService.js";

import {
    generateDocumentNumber
} from "../utils/generator.js";


export async function postContribution(data) {

    if (!data.memberId) {
        throw new Error("Member ID is required.");
    }

    if (!data.amount || Number(data.amount) <= 0) {
        throw new Error("Contribution amount must be greater than zero.");
    }

    const sequence = await getNextSequence("CON");

    const contributionNumber =
        generateDocumentNumber("CON", sequence);

    const contribution = {
        ...data,
        contributionNumber,
        status: "POSTED"
    };

    const contributionResult =
        await createContribution(contribution);

    const transactionResult =
        await createTransaction({
            type: "CONTRIBUTION",
            amount: data.amount,
            memberId: data.memberId,
            reference: contributionNumber,
            status: "SUCCESS"
        });

    const journalResult =
        await postJournal({
            title: "Contribution Received",
            debit: data.amount,
            credit: data.amount,
            createdBy: data.createdBy ?? "CMP"
        });

    const ledgerResult =
        await postLedger({
            account: "Cash Account",
            debit: data.amount,
            credit: 0,
            createdBy: data.createdBy ?? "CMP"
        });

    return {
        success: true,
        contributionNumber,
        contributionId: contributionResult.id ?? contributionResult,
        transactionId: transactionResult.id ?? transactionResult,
        journalNumber: journalResult.journalNumber,
        ledgerNumber: ledgerResult.ledgerNumber
    };

}
