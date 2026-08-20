/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC104 - STRENGTHEN CASH BOOK TRANSACTION TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: `console\\.log\\("Transaction Integration: PASS"\\);`,
        replace: `if (!cashBook.success) {
    throw new Error(
        "Cash Book generation verification failed."
    );
}

if (cashBook.account !== "Cash Account") {
    throw new Error(
        "Cash Book canonical account verification failed."
    );
}

if (cashBook.receipts.length !== 1) {
    throw new Error(
        "Cash Book receipt count verification failed."
    );
}

if (cashBook.payments.length !== 0) {
    throw new Error(
        "Cash Book payment count verification failed."
    );
}

if (cashBook.totalReceipts !== 10000) {
    throw new Error(
        "Cash Book total receipts verification failed."
    );
}

if (cashBook.totalPayments !== 0) {
    throw new Error(
        "Cash Book total payments verification failed."
    );
}

if (cashBook.closingBalance !== 10000) {
    throw new Error(
        "Cash Book closing balance verification failed."
    );
}

if (cashBook.totalTransactions !== 1) {
    throw new Error(
        "Cash Book transaction count verification failed."
    );
}

const receiptTotal =
    cashBook.receipts.reduce(
        (sum, item) =>
            sum + Number(item.receipt || 0),
        0
    );

const paymentTotal =
    cashBook.payments.reduce(
        (sum, item) =>
            sum + Number(item.payment || 0),
        0
    );

if (receiptTotal !== cashBook.totalReceipts) {
    throw new Error(
        "Cash Book receipt reconciliation failed."
    );
}

if (paymentTotal !== cashBook.totalPayments) {
    throw new Error(
        "Cash Book payment reconciliation failed."
    );
}

if (
    cashBook.closingBalance !==
    cashBook.totalReceipts -
    cashBook.totalPayments
) {
    throw new Error(
        "Cash Book closing balance calculation failed."
    );
}

console.log("");
console.log("Cash Book Generation Verification: PASS");
console.log("Canonical Account Verification: PASS");
console.log("Receipt Count Verification: PASS");
console.log("Payment Count Verification: PASS");
console.log("Total Receipts Verification: PASS");
console.log("Total Payments Verification: PASS");
console.log("Closing Balance Verification: PASS");
console.log("Transaction Count Verification: PASS");
console.log("Receipt Reconciliation Verification: PASS");
console.log("Payment Reconciliation Verification: PASS");
console.log("Closing Balance Calculation Verification: PASS");
console.log("Cash Book Transaction Integration Verification: PASS");

console.log("Transaction Integration: PASS");`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC104 - STRENGTHEN CASH BOOK TEST");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC104 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC104 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC104 PATCH COMPLETE");
    console.log("=========================================");
}

run();
