import fs from "fs/promises";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC068B - PROPAGATE TRANSACTION ID TO GENERAL LEDGER");
    console.log("=========================================");

    const path = "js/business/generalLedgerEngine.js";

    let content = await fs.readFile(path, "utf8");

    const target = `            transactions.push({
                batchNumber: batch.batchNumber,
                date: batch.createdAt,
                account: entry.account,
                debit: Number(entry.debit || 0),
                credit: Number(entry.credit || 0),
                balance: runningBalance
            });`;

    const replacement = `            transactions.push({
                batchNumber: batch.batchNumber,
                date: batch.createdAt,
                account: entry.account,
                debit: Number(entry.debit || 0),
                credit: Number(entry.credit || 0),
                transactionId: entry.transactionId,
                financialYearId: batch.financialYearId,
                accountingPeriodId: batch.accountingPeriodId,
                accountingPeriod: batch.accountingPeriod,
                balance: runningBalance
            });`;

    if (!content.includes(target)) {
        throw new Error(
            "Expected General Ledger transaction projection was not found."
        );
    }

    if (content.includes("transactionId: entry.transactionId")) {
        throw new Error(
            "Transaction ID propagation already exists."
        );
    }

    content = content.replace(target, replacement);

    await fs.writeFile(path, content, "utf8");
    await fs.access(path);

    console.log("PATCH TARGET: PASS");
    console.log("Transaction ID propagation: PASS");
    console.log("Financial Year context propagation: PASS");
    console.log("Accounting Period context propagation: PASS");
    console.log("=========================================");
    console.log("RC068B PATCH COMPLETE");
    console.log("=========================================");
}

run().catch(error => {
    console.error("PATCH FAIL");
    console.error(error);
    process.exit(1);
});
