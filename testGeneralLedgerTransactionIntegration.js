import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";
import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { generateGeneralLedger } from "./js/business/generalLedgerEngine.js";

async function runTest() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC069 - GENERAL LEDGER TRANSACTION INTEGRATION");
    console.log("=========================================");

    try {
        const seedResult = await seedChartOfAccounts();

        if (!seedResult || seedResult.success !== true) {
            throw new Error("Chart of Accounts seeding failed.");
        }

        const financialYear = await createYear({
            name: "FY 2026 General Ledger Integration Test",
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
            description: "RC069 General Ledger Integration Contribution"
        });

        if (!transaction || transaction.status !== "POSTED") {
            throw new Error("Expected transaction to be POSTED.");
        }

        const cashLedger = await generateGeneralLedger("Cash Account");

        if (!cashLedger || cashLedger.success !== true) {
            throw new Error("Cash Account General Ledger generation failed.");
        }

        if (cashLedger.account !== "Cash Account") {
            throw new Error(
                `Expected Cash Account ledger, received "${cashLedger.account}".`
            );
        }

        if (!Array.isArray(cashLedger.transactions)) {
            throw new Error("Cash Account transactions must be an array.");
        }

        const cashTransaction = cashLedger.transactions.find(
            entry => entry.transactionId === transaction.transactionId
        );

        if (!cashTransaction) {
            throw new Error(
                "Posted contribution transaction was not found in Cash Account General Ledger."
            );
        }

        if (Number(cashTransaction.debit || 0) !== 10000) {
            throw new Error(
                `Expected Cash Account debit of 10000, received ${cashTransaction.debit}.`
            );
        }

        if (Number(cashTransaction.credit || 0) !== 0) {
            throw new Error(
                "Cash Account credit should be 0."
            );
        }

        if (Number(cashTransaction.balance) !== 10000) {
            throw new Error(
                `Expected Cash Account running balance of 10000, received ${cashTransaction.balance}.`
            );
        }

        if (cashTransaction.financialYearId !== financialYear.id) {
            throw new Error(
                "Cash Account financial year context does not match."
            );
        }

        if (cashTransaction.accountingPeriodId !== period.id) {
            throw new Error(
                "Cash Account accounting period context does not match."
            );
        }

        const incomeLedger = await generateGeneralLedger(
            "Contribution Income"
        );

        if (!incomeLedger || incomeLedger.success !== true) {
            throw new Error(
                "Contribution Income General Ledger generation failed."
            );
        }

        if (incomeLedger.account !== "Contribution Income") {
            throw new Error(
                `Expected Contribution Income ledger, received "${incomeLedger.account}".`
            );
        }

        if (!Array.isArray(incomeLedger.transactions)) {
            throw new Error(
                "Contribution Income transactions must be an array."
            );
        }

        const incomeTransaction = incomeLedger.transactions.find(
            entry => entry.transactionId === transaction.transactionId
        );

        if (!incomeTransaction) {
            throw new Error(
                "Posted contribution transaction was not found in Contribution Income General Ledger."
            );
        }

        if (Number(incomeTransaction.debit || 0) !== 0) {
            throw new Error(
                "Contribution Income debit should be 0."
            );
        }

        if (Number(incomeTransaction.credit || 0) !== 10000) {
            throw new Error(
                `Expected Contribution Income credit of 10000, received ${incomeTransaction.credit}.`
            );
        }

        if (Number(incomeTransaction.balance) !== -10000) {
            throw new Error(
                `Expected Contribution Income running balance of -10000, received ${incomeTransaction.balance}.`
            );
        }

        if (incomeTransaction.financialYearId !== financialYear.id) {
            throw new Error(
                "Contribution Income financial year context does not match."
            );
        }

        if (incomeTransaction.accountingPeriodId !== period.id) {
            throw new Error(
                "Contribution Income accounting period context does not match."
            );
        }

        if (cashTransaction.transactionId !== incomeTransaction.transactionId) {
            throw new Error(
                "Debit and credit ledger entries do not share the same transaction ID."
            );
        }

        if (Number(cashLedger.closingBalance) !== 10000) {
            throw new Error(
                `Expected Cash Account closing balance of 10000, received ${cashLedger.closingBalance}.`
            );
        }

        if (Number(incomeLedger.closingBalance) !== -10000) {
            throw new Error(
                `Expected Contribution Income closing balance of -10000, received ${incomeLedger.closingBalance}.`
            );
        }

        console.log("Seed Chart of Accounts: PASS");
        console.log("Financial Year Creation: PASS");
        console.log("Accounting Period Creation: PASS");
        console.log("Transaction Posting: PASS");
        console.log("Cash Account General Ledger: PASS");
        console.log("Cash Account Debit Integration: PASS");
        console.log("Cash Account Balance Integration: PASS");
        console.log("Cash Account Financial Year Context: PASS");
        console.log("Cash Account Accounting Period Context: PASS");
        console.log("Contribution Income General Ledger: PASS");
        console.log("Contribution Income Credit Integration: PASS");
        console.log("Contribution Income Balance Integration: PASS");
        console.log("Contribution Income Financial Year Context: PASS");
        console.log("Contribution Income Accounting Period Context: PASS");
        console.log("Transaction ID Reconciliation: PASS");
        console.log("Closing Balance Reconciliation: PASS");

        console.log("");
        console.log("CASH ACCOUNT GENERAL LEDGER:");
        console.log(JSON.stringify(cashLedger, null, 4));

        console.log("");
        console.log("CONTRIBUTION INCOME GENERAL LEDGER:");
        console.log(JSON.stringify(incomeLedger, null, 4));

        console.log("");
        console.log("=========================================");
        console.log("RC069 TEST COMPLETE: PASS");
        console.log("=========================================");
    } catch (error) {
        console.error("RC069 GENERAL LEDGER TEST: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

runTest();
