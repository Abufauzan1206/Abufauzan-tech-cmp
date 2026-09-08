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
    getMemberById
} from "../services/memberService.js";

import {
    getAuthenticatedProfile
} from "../controllers/accessController.js";

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

    const session = await getAuthenticatedProfile();

    if (!session) {
        throw new Error("Authenticated user required.");
    }

    const role = session.profile?.role;

    if (
        role !== "super_admin" &&
        role !== "cooperative_admin" &&
        role !== "cooperativeAdmin"
    ) {
        throw new Error("Contribution posting access required.");
    }

    if (
        typeof data?.memberId !== "string" ||
        !data.memberId.trim()
    ) {
        throw new Error("Member ID is required.");
    }

    if (!data.amount || Number(data.amount) <= 0) {
        throw new Error(
            "Contribution amount must be greater than zero."
        );
    }

    const memberId = data.memberId.trim();
    const member = await getMemberById(memberId);

    if (!member) {
        throw new Error("Selected member was not found.");
    }

    const memberCooperativeId =
        typeof member.cooperativeId === "string"
            ? member.cooperativeId.trim()
            : "";

    if (!memberCooperativeId) {
        throw new Error(
            "Selected member has no cooperativeId."
        );
    }

    if (
        role === "cooperative_admin" ||
        role === "cooperativeAdmin"
    ) {
        const adminCooperativeId =
            typeof session.profile?.cooperativeId === "string"
                ? session.profile.cooperativeId.trim()
                : "";

        if (!adminCooperativeId) {
            throw new Error(
                "Cooperative administrator profile has no cooperativeId."
            );
        }

        if (adminCooperativeId !== memberCooperativeId) {
            throw new Error(
                "Contribution posting outside your cooperative is not allowed."
            );
        }
    }

    const ownedData = {
        ...data,
        memberId,
        cooperativeId: memberCooperativeId
    };

    const sequence =
        await getNextSequence("CON");

    const contributionNumber =
        generateDocumentNumber("CON", sequence);

    const contribution = {
        ...ownedData,
        contributionNumber,
        status: "POSTED"
    };

    const contributionResult =
        await createContribution(contribution);

    const transactionResult =
        await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: data.amount,
            memberId,
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
