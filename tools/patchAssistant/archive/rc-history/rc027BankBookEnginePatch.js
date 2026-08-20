import fs from "fs/promises";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC027 - BANK BOOK ENGINE");
    console.log("=========================================");

    const path =
        "js/business/bankBookEngine.js";

    const content = `/**
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
        await generateGeneralLedger("Bank");

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
            "Bank",

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
`;

    await fs.writeFile(
        path,
        content,
        "utf8"
    );

    console.log("CREATE FILE: PASS");

    await fs.access(path);

    console.log("VERIFY: PASS");

    console.log("=========================================");
    console.log("RC027 COMPLETE");
    console.log("=========================================");

}

run().catch(error => {

    console.error("PATCH FAIL");
    console.error(error);

    process.exit(1);

});
