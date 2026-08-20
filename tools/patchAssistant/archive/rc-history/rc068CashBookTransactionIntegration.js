import fs from "fs/promises";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC068 - CASH BOOK TRANSACTION INTEGRATION");
    console.log("=========================================");

    const path = "testCashBookTransactionIntegration.js";

    const content = `import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";
import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { generateCashBook } from "./js/business/cashBookEngine.js";

async function runTest() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC068 - CASH BOOK TRANSACTION INTEGRATION");
    console.log("=========================================");

    try {
        const seedResult = await seedChartOfAccounts();

        if (!seedResult || seedResult.success !== true) {
            throw new Error("Chart of Accounts seeding failed.");
        }

        const financialYear = await createYear({
            name: "FY 2026 Cash Book Integration Test",
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

        const transaction = await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: 10000,
            description: "RC068 Cash Book Integration Contribution"
        });

        if (!transaction || transaction.status !== "POSTED") {
            throw new Error("Expected transaction to be POSTED.");
        }

        const result = await generateCashBook();

        if (!result || result.success !== true) {
            throw new Error("Cash Book generation failed.");
        }

        if (result.account !== "Cash Account") {
            throw new Error(
                \`Expected canonical account "Cash Account", received "\${result.account}".\`
            );
        }

        if (!Array.isArray(result.receipts)) {
            throw new Error("Cash Book receipts must be an array.");
        }

        if (!Array.isArray(result.payments)) {
            throw new Error("Cash Book payments must be an array.");
        }

        if (!Array.isArray(result.transactions)) {
            throw new Error("Cash Book transactions must be an array.");
        }

        const calculatedReceipts = result.receipts.reduce(
            (total, entry) => total + Number(entry.receipt || 0),
            0
        );

        const calculatedPayments = result.payments.reduce(
            (total, entry) => total + Number(entry.payment || 0),
            0
        );

        if (calculatedReceipts !== 10000) {
            throw new Error(
                \`Expected Cash Book receipts of 10000, received \${calculatedReceipts}.\`
            );
        }

        if (calculatedPayments !== 0) {
            throw new Error(
                \`Expected Cash Book payments of 0, received \${calculatedPayments}.\`
            );
        }

        if (Number(result.totalReceipts) !== 10000) {
            throw new Error(
                \`Expected totalReceipts of 10000, received \${result.totalReceipts}.\`
            );
        }

        if (Number(result.totalPayments) !== 0) {
            throw new Error(
                \`Expected totalPayments of 0, received \${result.totalPayments}.\`
            );
        }

        if (Number(result.closingBalance) !== 10000) {
            throw new Error(
                \`Expected closingBalance of 10000, received \${result.closingBalance}.\`
            );
        }

        if (Number(result.totalTransactions) !== result.transactions.length) {
            throw new Error(
                "Transaction count does not reconcile."
            );
        }

        if (result.transactions.length < 1) {
            throw new Error(
                "Expected at least one Cash Book transaction."
            );
        }

        const matchingTransaction = result.transactions.find(
            entry =>
                entry.transactionId === transaction.transactionId
        );

        if (!matchingTransaction) {
            throw new Error(
                "Posted contribution transaction was not found in Cash Book."
            );
        }

        if (Number(matchingTransaction.debit || 0) !== 10000) {
            throw new Error(
                "Cash Book transaction debit does not equal 10000."
            );
        }

        console.log("Seed Chart of Accounts: PASS");
        console.log("Financial Year Creation: PASS");
        console.log("Accounting Period Creation: PASS");
        console.log("Transaction Posting: PASS");
        console.log("Cash Book Generation: PASS");
        console.log("Canonical Account: PASS");
        console.log("Receipt Integration: PASS");
        console.log("Payment Integration: PASS");
        console.log("Closing Balance Integration: PASS");
        console.log("Transaction Integration: PASS");
        console.log("");
        console.log("CASH BOOK RESULT:");
        console.log(JSON.stringify(result, null, 4));
        console.log("");
        console.log("=========================================");
        console.log("RC068 TEST COMPLETE: PASS");
        console.log("=========================================");
    } catch (error) {
        console.error("RC068 CASH BOOK TEST: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

runTest();
`;

    await fs.writeFile(path, content, "utf8");
    await fs.access(path);

    console.log("CREATE TEST FILE: PASS");
    console.log(`Test: ${path}`);
    console.log("=========================================");
    console.log("RC068 PATCH COMPLETE");
    console.log("=========================================");
}

run().catch(error => {
    console.error("PATCH FAIL");
    console.error(error);
    process.exit(1);
});
