import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/journalBuilderEngine.js",
        search: `account:
                                "Cash Account",
                            debit:
                                transaction.amount,`,
        replace: `account:
                                transaction.account ?? "Cash Account",
                            debit:
                                transaction.amount,`,
        ignoreWhitespace: true
    },
    {
        path: "testBankBookTransactionIntegration.js",
        search: `const receiptTransaction = await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: 10000,
            description: "RC070 Bank Receipt Integration"
        });`,
        replace: `const receiptTransaction = await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: 10000,
            account: "Bank Account",
            description: "RC070 Bank Receipt Integration"
        });`,
        ignoreWhitespace: true
    }
];

async function run() {
    try {
        const result = await transaction(patches);

        if (!result || result.success !== true) {
            throw new Error(result?.error || "RC071 patch transaction failed.");
        }

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC071 - CONTRIBUTION ACCOUNT ROUTING PATCH");
        console.log("=========================================");
        console.log(`PATCH: PASS (${result.count} patches applied)`);
    } catch (error) {
        console.error("RC071 PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
