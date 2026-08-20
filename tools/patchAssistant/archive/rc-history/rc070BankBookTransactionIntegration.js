import fs from "fs/promises";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070 - BANK BOOK TRANSACTION INTEGRATION");
    console.log("=========================================");

    const path = "testBankBookTransactionIntegration.js";

    const content = `import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";
import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { generateBankBook } from "./js/business/bankBookEngine.js";

async function runTest() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070 - BANK BOOK TRANSACTION INTEGRATION");
    console.log("=========================================");

    try {
        const seedResult = await seedChartOfAccounts();

        if (!seedResult || seedResult.success !== true) {
            throw new Error("Chart of Accounts seeding failed.");
        }

        const financialYear = await createYear({
            name: "FY 2026 Bank Book Integration Test",
            startDate: "2026-01-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z"
        });

        if (!financialYear || financialYear.success !== true) {
            throw new Error("Financial year creation failed.");
        }

        const period = await createPeriod({
            name: "2026",
            financialYearId: financialYear.id,
            startDate: "2026-01-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z"
        });

        if (!period || period.success !== true) {
            throw new Error("Accounting period creation failed.");
        }

        const receiptTransaction = await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: 10000,
            description: "RC070 Bank Receipt Integration"
        });

        if (!receiptTransaction || receiptTransaction.status !== "POSTED") {
            throw new Error("Receipt transaction was not posted.");
        }

        const receiptBankBook = await generateBankBook();

        if (!receiptBankBook || receiptBankBook.success !== true) {
            throw new Error("Bank Book generation failed after receipt.");
        }

        if (receiptBankBook.account !== "Bank") {
            throw new Error(
                \`Expected canonical Bank account, received "\${receiptBankBook.account}".\`
            );
        }

        const receipt = receiptBankBook.receipts.find(
            entry => entry.transactionId === receiptTransaction.transactionId
        );

        if (!receipt) {
            throw new Error(
                "Receipt transaction was not found in Bank Book."
            );
        }

        if (Number(receipt.receipt || 0) !== 10000) {
            throw new Error(
                \`Expected receipt of 10000, received \${receipt.receipt}.\`
            );
        }

        if (Number(receipt.payment || 0) !== 0) {
            throw new Error("Receipt payment value should be 0.");
        }

        if (receipt.financialYearId !== financialYear.id) {
            throw new Error(
                "Receipt financial year context does not match."
            );
        }

        if (receipt.accountingPeriodId !== period.id) {
            throw new Error(
                "Receipt accounting period context does not match."
            );
        }

        if (receipt.accountingPeriod !== "2026") {
            throw new Error(
                \`Expected accounting period 2026, received \${receipt.accountingPeriod}.\`
            );
        }

        const paymentTransaction = await CMPTransactionEngine.create({
            type: "EXPENSE",
            amount: 3000,
            description: "RC070 Bank Payment Integration"
        });

        if (!paymentTransaction || paymentTransaction.status !== "POSTED") {
            throw new Error("Payment transaction was not posted.");
        }

        const bankBook = await generateBankBook();

        if (!bankBook || bankBook.success !== true) {
            throw new Error("Bank Book generation failed.");
        }

        const payment = bankBook.payments.find(
            entry => entry.transactionId === paymentTransaction.transactionId
        );

        if (!payment) {
            throw new Error(
                "Payment transaction was not found in Bank Book."
            );
        }

        if (Number(payment.payment || 0) !== 3000) {
            throw new Error(
                \`Expected payment of 3000, received \${payment.payment}.\`
            );
        }

        if (Number(payment.receipt || 0) !== 0) {
            throw new Error("Payment receipt value should be 0.");
        }

        if (payment.financialYearId !== financialYear.id) {
            throw new Error(
                "Payment financial year context does not match."
            );
        }

        if (payment.accountingPeriodId !== period.id) {
            throw new Error(
                "Payment accounting period context does not match."
            );
        }

        if (payment.accountingPeriod !== "2026") {
            throw new Error(
                \`Expected accounting period 2026, received \${payment.accountingPeriod}.\`
            );
        }

        if (receiptTransaction.transactionId === paymentTransaction.transactionId) {
            throw new Error(
                "Receipt and payment transactions must have different transaction IDs."
            );
        }

        const matchingReceipt = bankBook.receipts.find(
            entry => entry.transactionId === receiptTransaction.transactionId
        );

        const matchingPayment = bankBook.payments.find(
            entry => entry.transactionId === paymentTransaction.transactionId
        );

        if (!matchingReceipt || !matchingPayment) {
            throw new Error(
                "Receipt/payment transaction identity reconciliation failed."
            );
        }

        const expectedReceipts =
            Number(matchingReceipt.receipt || 0);

        const expectedPayments =
            Number(matchingPayment.payment || 0);

        const expectedClosingBalance =
            expectedReceipts - expectedPayments;

        if (Number(bankBook.totalReceipts) !== expectedReceipts) {
            throw new Error(
                "Bank Book total receipts do not reconcile."
            );
        }

        if (Number(bankBook.totalPayments) !== expectedPayments) {
            throw new Error(
                "Bank Book total payments do not reconcile."
            );
        }

        if (Number(bankBook.closingBalance) !== expectedClosingBalance) {
            throw new Error(
                \`Bank Book closing balance mismatch. Expected \${expectedClosingBalance}, received \${bankBook.closingBalance}.\`
            );
        }

        if (
            Number(bankBook.totalTransactions) !==
            bankBook.transactions.length
        ) {
            throw new Error(
                "Bank Book transaction count does not reconcile."
            );
        }

        console.log("Seed Chart of Accounts: PASS");
        console.log("Financial Year Creation: PASS");
        console.log("Accounting Period Creation: PASS");
        console.log("Receipt Transaction Posting: PASS");
        console.log("Receipt Integration: PASS");
        console.log("Receipt Transaction ID: PASS");
        console.log("Receipt Financial Year Context: PASS");
        console.log("Receipt Accounting Period Context: PASS");
        console.log("Payment Transaction Posting: PASS");
        console.log("Payment Integration: PASS");
        console.log("Payment Transaction ID: PASS");
        console.log("Payment Financial Year Context: PASS");
        console.log("Payment Accounting Period Context: PASS");
        console.log("Receipt/Payment Identity Reconciliation: PASS");
        console.log("Total Receipts Reconciliation: PASS");
        console.log("Total Payments Reconciliation: PASS");
        console.log("Closing Balance Reconciliation: PASS");
        console.log("Transaction Count Reconciliation: PASS");

        console.log("");
        console.log("BANK BOOK RESULT:");
        console.log(JSON.stringify(bankBook, null, 4));

        console.log("");
        console.log("=========================================");
        console.log("RC070 TEST COMPLETE: PASS");
        console.log("=========================================");
    } catch (error) {
        console.error("RC070 BANK BOOK TEST: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

runTest();
`;

    await fs.writeFile(path, content, "utf8");
    await fs.access(path);

    console.log("CREATE TEST FILE: PASS");
    console.log("Test: " + path);
    console.log("=========================================");
    console.log("RC070 PATCH COMPLETE");
    console.log("=========================================");
}

run().catch(error => {
    console.error("PATCH FAIL");
    console.error(error);
    process.exit(1);
});
