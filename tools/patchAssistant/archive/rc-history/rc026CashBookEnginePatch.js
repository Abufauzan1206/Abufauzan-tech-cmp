import fs from "fs/promises";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC026 - CASH BOOK ENGINE");
    console.log("=========================================");

    const path =
        "js/business/cashBookEngine.js";

    const content = `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: cashBookEngine.js
 * Version: 1.0.0
 *
 * Cash Book Engine
 * =====================================================
 */

import {
    generateGeneralLedger
} from "./generalLedgerEngine.js";


export async function generateCashBook() {

    const generalLedger =
        await generateGeneralLedger("Cash Account");


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
            "Cash Account",

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
    console.log("RC026 COMPLETE");
    console.log("=========================================");

}

run().catch(error => {

    console.error("PATCH FAIL");
    console.error(error);
    process.exit(1);

});
