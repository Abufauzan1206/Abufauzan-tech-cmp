import { transaction } from "../patchEngine.js";

const testFile = "testIncomeExpenditure.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC059 - ALIGN INCOME & EXPENDITURE ACCOUNTING PERIOD");
    console.log("=========================================");

    const result = await transaction([
        {
            path: testFile,
            mode: "regex",
            search:
                'import \\{ seedChartOfAccounts \\} from "\\.\\/js\\/seeders\\/chartOfAccountsSeeder\\.js";',
            replace:
`import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";`
        },
        {
            path: testFile,
            mode: "regex",
            search:
                'await seedChartOfAccounts\\(\\);',
            replace:
`await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Income Expenditure Test",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});

const accountingPeriod = await createPeriod({
    name: "2026",
    financialYearId: financialYear.id,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});`
        }
    ]);

    console.log("RC059 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC059 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC059 PATCH COMPLETE");
    console.log("=========================================");
}

run();
