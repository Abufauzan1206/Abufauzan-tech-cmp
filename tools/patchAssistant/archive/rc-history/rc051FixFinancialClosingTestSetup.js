import { transaction } from "../patchEngine.js";

const testFile = "testFinancialClosingCoordinator.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC051 - FIX FINANCIAL CLOSING TEST SETUP");
    console.log("=========================================");

    const result = await transaction([
        {
            path: testFile,
            mode: "regex",
            search:
                'import \\{ CMPTransactionEngine \\} from "\\.\\/js\\/business\\/transactionEngine\\.js";',
            replace:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";`
        },
        {
            path: testFile,
            mode: "regex",
            search:
                'CMPTransactionEngine\\.create\\(\\{\\s*type:\\s*"CONTRIBUTION",\\s*amount:\\s*10000,\\s*description:\\s*"Monthly Contribution"\\s*\\}\\);',
            replace:
`await seedChartOfAccounts();

await CMPTransactionEngine.create({
    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"
});`
        }
    ]);

    console.log("RC051 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC051 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC051 PATCH COMPLETE");
    console.log("=========================================");
}

run();
