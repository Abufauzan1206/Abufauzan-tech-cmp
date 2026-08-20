import fs from "fs/promises";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC066 - BANK BOOK ENGINE TEST");
    console.log("=========================================");

    const path = "testBankBookEngine.js";

    const content = `import { generateBankBook } from "./js/business/bankBookEngine.js";

async function runTest() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC066 - BANK BOOK ENGINE TEST");
    console.log("=========================================");

    try {
        const result = await generateBankBook();

        if (!result || result.success !== true) {
            throw new Error("Bank Book generation failed.");
        }

        if (result.account !== "Bank") {
            throw new Error(
                \`Expected canonical account "Bank", received "\${result.account}".\`
            );
        }

        if (!Array.isArray(result.receipts)) {
            throw new Error("Receipts must be an array.");
        }

        if (!Array.isArray(result.payments)) {
            throw new Error("Payments must be an array.");
        }

        if (!Array.isArray(result.transactions)) {
            throw new Error("Transactions must be an array.");
        }

        const calculatedReceipts = result.receipts.reduce(
            (total, entry) => total + Number(entry.receipt || 0),
            0
        );

        const calculatedPayments = result.payments.reduce(
            (total, entry) => total + Number(entry.payment || 0),
            0
        );

        if (calculatedReceipts !== Number(result.totalReceipts || 0)) {
            throw new Error("Receipt total does not reconcile.");
        }

        if (calculatedPayments !== Number(result.totalPayments || 0)) {
            throw new Error("Payment total does not reconcile.");
        }

        const expectedClosingBalance =
            calculatedReceipts - calculatedPayments;

        if (Number(result.closingBalance) !== expectedClosingBalance) {
            throw new Error(
                \`Closing balance mismatch. Expected \${expectedClosingBalance}, received \${result.closingBalance}.\`
            );
        }

        if (Number(result.totalTransactions) !== result.transactions.length) {
            throw new Error("Transaction count does not reconcile.");
        }

        console.log("GENERATE BANK BOOK(): PASS");
        console.log("Canonical Account: PASS");
        console.log("Receipts Reconciliation: PASS");
        console.log("Payments Reconciliation: PASS");
        console.log("Closing Balance Reconciliation: PASS");
        console.log("Transaction Count Reconciliation: PASS");
        console.log("");
        console.log("BANK BOOK RESULT:");
        console.log(JSON.stringify(result, null, 4));
        console.log("");
        console.log("=========================================");
        console.log("RC066 TEST COMPLETE: PASS");
        console.log("=========================================");
    } catch (error) {
        console.error("BANK BOOK TEST: FAIL");
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
    console.log("RC066 PATCH COMPLETE");
    console.log("=========================================");
}

run().catch(error => {
    console.error("PATCH FAIL");
    console.error(error);
    process.exit(1);
});
