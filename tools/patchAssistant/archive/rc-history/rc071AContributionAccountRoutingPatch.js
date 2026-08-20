import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/journalBuilderEngine.js",
        mode: "regex",
        search: '(^\\s*case "CONTRIBUTION":[\\s\\S]*?entries:\\s*\\[[\\s\\S]*?\\{\\s*account:\\s*)"Cash Account"(,\\s*debit:\\s*transaction\\.amount,)',
        replace: '$1transaction.account ?? "Cash Account"$2'
    },
    {
        path: "testBankBookTransactionIntegration.js",
        mode: "regex",
        search: '(const receiptTransaction = await CMPTransactionEngine\\.create\\(\\{\\s*type:\\s*"CONTRIBUTION",\\s*amount:\\s*10000,)(\\s*description:\\s*"RC070 Bank Receipt Integration")',
        replace: '$1\\n            account: "Bank Account",$2'
    }
];

async function run() {
    try {
        const result = await transaction(patches);

        if (!result || result.success !== true) {
            throw new Error(
                result?.error || "RC071A patch transaction failed."
            );
        }

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC071A - CONTRIBUTION ACCOUNT ROUTING PATCH");
        console.log("=========================================");
        console.log(`PATCH: PASS (${result.count} patches applied)`);
    } catch (error) {
        console.error("RC071A PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
