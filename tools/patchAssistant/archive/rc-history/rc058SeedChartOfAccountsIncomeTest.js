import { transaction } from "../patchEngine.js";

const testFile = "testIncomeExpenditure.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC058 - SEED CHART OF ACCOUNTS INCOME TEST");
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
                '// Sample transactions',
            replace:
                `await seedChartOfAccounts();

// Sample transactions`
        }
    ]);

    console.log("RC058 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC058 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC058 PATCH COMPLETE");
    console.log("=========================================");
}

run();
