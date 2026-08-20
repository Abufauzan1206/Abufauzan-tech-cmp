import { transaction } from "../patchEngine.js";

const testFile = "testBalanceSheet.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC061 - ALIGN BALANCE SHEET NODE TEST");
    console.log("=========================================");

    const result = await transaction([

        {
            path: testFile,
            mode: "regex",
            search:
                'import \\{ CMPTransactionEngine \\} from "\\.\\/js\\/business\\/transactionEngine\\.js";\\s*import \\{ CMPBalanceSheetEngine \\} from "\\.\\/js\\/business\\/balanceSheetEngine\\.js";',

            replace:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { generateBalanceSheet } from "./js/business/balanceSheetEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";`
        },

        {
            path: testFile,
            mode: "regex",
            search:
                '// Sample transaction\\s*CMPTransactionEngine\\.create\\(\\{\\s*type:\\s*"CONTRIBUTION",\\s*amount:\\s*10000,\\s*description:\\s*"Monthly Contribution"\\s*\\}\\);',

            replace:
`await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Balance Sheet Test",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

await createPeriod({
    name: "2026",
    financialYearId: financialYear.id,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

await CMPTransactionEngine.create({
    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"
});`
        },

        {
            path: testFile,
            mode: "regex",
            search:
                'const report = CMPBalanceSheetEngine\\.generate\\(\\);',

            replace:
`const report =
    await generateBalanceSheet();`
        }

    ]);

    console.log("RC061 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC061 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC061 PATCH COMPLETE");
    console.log("=========================================");
}

run();
