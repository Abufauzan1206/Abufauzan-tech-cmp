import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testGeneralLedgerTransactionIntegration.js",
        mode: "regex",
        search: String.raw`console\.log\("Journal/Ledger Reference Reconciliation: PASS"\);`,
        replace: `console.log("Journal/Ledger Reference Reconciliation: PASS");

        if (journal.status !== "POSTED") {
            throw new Error(
                \`Expected persisted contribution journal status POSTED, received \${journal.status}.\`
            );
        }

        if (journal.financialYearId !== financialYear.id) {
            throw new Error(
                "Persisted contribution journal financial year context does not match."
            );
        }

        if (journal.accountingPeriodId !== period.id) {
            throw new Error(
                "Persisted contribution journal accounting period context does not match."
            );
        }

        if (journal.accountingPeriod !== period.name) {
            throw new Error(
                "Persisted contribution journal accounting period name does not match."
            );
        }

        if (ledgerBatch.status !== "POSTED") {
            throw new Error(
                \`Expected persisted contribution ledger batch status POSTED, received \${ledgerBatch.status}.\`
            );
        }

        if (ledgerBatch.financialYearId !== financialYear.id) {
            throw new Error(
                "Persisted contribution ledger batch financial year context does not match."
            );
        }

        if (ledgerBatch.accountingPeriodId !== period.id) {
            throw new Error(
                "Persisted contribution ledger batch accounting period context does not match."
            );
        }

        if (ledgerBatch.accountingPeriod !== period.name) {
            throw new Error(
                "Persisted contribution ledger batch accounting period name does not match."
            );
        }

        if (Number(ledgerBatch.totalDebit || 0) !== 10000) {
            throw new Error(
                \`Expected ledger batch total debit 10000, received \${ledgerBatch.totalDebit}.\`
            );
        }

        if (Number(ledgerBatch.totalCredit || 0) !== 10000) {
            throw new Error(
                \`Expected ledger batch total credit 10000, received \${ledgerBatch.totalCredit}.\`
            );
        }

        if (!Array.isArray(ledgerBatch.entries)) {
            throw new Error(
                "Persisted contribution ledger batch entries must be an array."
            );
        }

        if (ledgerBatch.entries.length !== 2) {
            throw new Error(
                \`Expected 2 persisted ledger batch entries, received \${ledgerBatch.entries.length}.\`
            );
        }

        const persistedCashEntry = ledgerBatch.entries.find(
            entry => entry.account === "Cash Account"
        );

        const persistedIncomeEntry = ledgerBatch.entries.find(
            entry => entry.account === "Contribution Income"
        );

        if (!persistedCashEntry) {
            throw new Error(
                "Persisted ledger batch is missing Cash Account entry."
            );
        }

        if (!persistedIncomeEntry) {
            throw new Error(
                "Persisted ledger batch is missing Contribution Income entry."
            );
        }

        if (Number(persistedCashEntry.debit || 0) !== 10000) {
            throw new Error(
                "Persisted Cash Account ledger batch debit should be 10000."
            );
        }

        if (Number(persistedIncomeEntry.credit || 0) !== 10000) {
            throw new Error(
                "Persisted Contribution Income ledger batch credit should be 10000."
            );
        }

        console.log("Journal POSTED Status: PASS");
        console.log("Journal Financial Year Persistence: PASS");
        console.log("Journal Accounting Period Persistence: PASS");
        console.log("Ledger Batch POSTED Status: PASS");
        console.log("Ledger Batch Financial Year Persistence: PASS");
        console.log("Ledger Batch Accounting Period Persistence: PASS");
        console.log("Ledger Batch Debit Total: PASS");
        console.log("Ledger Batch Credit Total: PASS");
        console.log("Ledger Batch Entry Count: PASS");
        console.log("Persisted Cash Account Entry: PASS");
        console.log("Persisted Contribution Income Entry: PASS");
        console.log("Persisted Double-Entry Content: PASS");`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC123H - CONTRIBUTION PERSISTED CONTENT VERIFICATION PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC123H TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC123H PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC123H PATCH COMPLETE");
    console.log("=========================================");
}

run();
