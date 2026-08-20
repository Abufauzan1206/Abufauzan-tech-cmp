/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: contributionPostingEngine.js
 * Version: 2.0.0
 *
 * Contribution Posting Engine
 * =====================================================
 */

import {
    createContribution
} from "../services/contributionService.js";

import {
    CMPTransactionEngine
} from "./transactionEngine.js";



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
        throw new Error(
            "Contribution amount must be greater than zero."
        );
    }

    const sequence =
        await getNextSequence("CON");

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
        await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: data.amount,
            memberId: data.memberId,
            reference: contributionNumber,
            description: "Member Contribution",
            account: "Cash Account",
            createdBy: data.createdBy ?? "CMP"
        });

    

    return {
        success: true,
        contributionNumber,
        contributionId: contributionResult.id ?? contributionResult,
        transactionId: transactionResult.id ?? transactionResult,
        journalNumber:
            transactionResult.journalNumber,
        ledgerBatchNumber:
            transactionResult.ledgerBatchNumber,
        journalDocumentId:
            transactionResult.journalDocumentId,
        ledgerDocumentId:
            transactionResult.ledgerDocumentId,
        accountingPeriod:
            transactionResult.accountingPeriod,
        financialYearId:
            transactionResult.financialYearId,
        accountingPeriodId:
            transactionResult.accountingPeriodId
    };

}
