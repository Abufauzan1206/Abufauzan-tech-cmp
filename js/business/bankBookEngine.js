/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: bankBookEngine.js
 * Version: 1.0.0
 *
 * Bank Book Engine
 * =====================================================
 */

import {
    generateGeneralLedger
} from "./generalLedgerEngine.js";


export async function generateBankBook() {

    const generalLedger =
        await generateGeneralLedger("Bank Account");

    const receipts = [];
    const payments = [];

    let totalReceipts = 0;
    let totalPayments = 0;


    for (const transaction of
        generalLedger.transactions || []) {

        const debit =
            Number(transaction.debit || 0);

        const credit =
            Number(transaction.credit || 0);


        if (debit > 0) {

            receipts.push({
                ...transaction,
                receipt: debit,
                payment: 0
            });

            totalReceipts += debit;

        }


        if (credit > 0) {

            payments.push({
                ...transaction,
                receipt: 0,
                payment: credit
            });

            totalPayments += credit;

        }

    }


    return {

        success: true,

        account:
            "Bank Account",

        receipts,

        payments,

        totalReceipts,

        totalPayments,

        closingBalance:
            generalLedger.closingBalance,

        totalTransactions:
            generalLedger.totalTransactions,

        transactions:
            generalLedger.transactions

    };

}
