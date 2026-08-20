import { transaction } from "../patchEngine.js";

const testFile = "testBalanceSheetEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC060 - ALIGN BALANCE SHEET NODE TEST");
    console.log("=========================================");

    const result = await transaction([

        {
            path: testFile,
            mode: "regex",
            search:
                'import \\{ generateBalanceSheet \\} from "\\.\\/js\\/business\\/balanceSheetEngine\\.js";',

            replace:
`import { generateBalanceSheet } from "./js/business/balanceSheetEngine.js";
import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";
import { CMPTransactionEngine } from "./js/business/transactionEngine.js";`
        },

        {
            path: testFile,
            mode: "regex",
            search:
                'const result = await generateBalanceSheet\\(\\);',

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
    description: "Balance Sheet Test Contribution"
});

const result = await generateBalanceSheet();`
        },

        {
            path: testFile,
            mode: "regex",
            search:
                'if \\(!result\\.balanced\\)',

            replace:
`if (!result.balanced) {

    throw new Error(
        "Balance sheet is not balanced."
    );

}

console.log("BALANCE SHEET RESULT:");
console.log(JSON.stringify(result, null, 4));

console.log("");
console.log("BALANCE SHEET TEST: PASS");

if (false)`
        }

    ]);

    console.log("RC060 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC060 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC060 PATCH COMPLETE");
    console.log("=========================================");
}

run();
