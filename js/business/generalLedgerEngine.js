/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: generalLedgerEngine.js
 * Version: 2.0.0
 *
 * General Ledger Engine
 * =====================================================
 */

import {
    getAllLedgerBatches
} from "../services/generalLedgerService.js";

export async function generateGeneralLedger(accountName) {

    if (!accountName) {
        throw new Error("Account name is required.");
    }

    const batches =
        await getAllLedgerBatches();

    // Sort ledger batches from oldest to newest
    batches.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const transactions = [];

    let runningBalance = 0;

    for (const batch of batches) {

        for (const entry of batch.entries || []) {

            if (entry.account !== accountName) {
                continue;
            }

            runningBalance +=
                Number(entry.debit || 0) -
                Number(entry.credit || 0);

            transactions.push({
                batchNumber: batch.batchNumber,
                date: batch.createdAt,
                account: entry.account,
                debit: Number(entry.debit || 0),
                credit: Number(entry.credit || 0),
                transactionId: entry.transactionId,
                financialYearId: batch.financialYearId,
                accountingPeriodId: batch.accountingPeriodId,
                accountingPeriod: batch.accountingPeriod,
                balance: runningBalance
            });

        }

    }

    return {

        success: true,
        account: accountName,
        totalTransactions: transactions.length,
        closingBalance: runningBalance,
        transactions

    };

}
