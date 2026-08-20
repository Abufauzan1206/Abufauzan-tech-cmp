import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testGeneralLedgerTransactionIntegration.js",
        mode: "regex",
        search: String.raw`if \(!transaction \|\| transaction\.status !== "POSTED"\) \{[\s\S]*?throw new Error\("Expected transaction to be POSTED\."\);\s*\}`,
        replace: `if (!transaction || transaction.status !== "POSTED") {
            throw new Error("Expected transaction to be POSTED.");
        }

        if (transaction.reference !== "CON-REFERENCE-001") {
            throw new Error(
                \`Expected transaction reference CON-REFERENCE-001, received \${transaction.reference}.\`
            );
        }

        console.log("Transaction Reference: PASS");`
    },
    {
        path: "testGeneralLedgerTransactionIntegration.js",
        mode: "regex",
        search: String.raw`const cashLedger = await generateGeneralLedger\("Cash Account"\);`,
        replace: `const cashLedger = await generateGeneralLedger("Cash Account");

        const { findJournalByReference } =
            await import("./js/services/journalService.js");

        const { findLedgerBatchByJournalReference } =
            await import("./js/services/ledgerBatchService.js");

        const journal =
            await findJournalByReference("CON-REFERENCE-001");

        if (!journal) {
            throw new Error(
                "Contribution journal was not persisted with the expected reference."
            );
        }

        if (journal.reference !== "CON-REFERENCE-001") {
            throw new Error(
                \`Expected persisted journal reference CON-REFERENCE-001, received \${journal.reference}.\`
            );
        }

        if (!journal.journalNumber) {
            throw new Error(
                "Persisted contribution journal has no journal number."
            );
        }

        const ledgerBatch =
            await findLedgerBatchByJournalReference("CON-REFERENCE-001");

        if (!ledgerBatch) {
            throw new Error(
                "Contribution ledger batch was not persisted with the expected journal reference."
            );
        }

        if (ledgerBatch.journalReference !== "CON-REFERENCE-001") {
            throw new Error(
                \`Expected ledger batch journalReference CON-REFERENCE-001, received \${ledgerBatch.journalReference}.\`
            );
        }

        if (!ledgerBatch.batchNumber) {
            throw new Error(
                "Persisted contribution ledger batch has no batch number."
            );
        }

        if (ledgerBatch.journalReference !== journal.reference) {
            throw new Error(
                "Journal reference and ledger batch journalReference do not match."
            );
        }

        console.log("Journal Reference Persistence: PASS");
        console.log("Ledger Batch Reference Persistence: PASS");
        console.log("Journal/Ledger Reference Reconciliation: PASS");`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC123G - CONTRIBUTION PERSISTED REFERENCE VERIFICATION PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC123G TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC123G PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC123G PATCH COMPLETE");
    console.log("=========================================");
}

run();
