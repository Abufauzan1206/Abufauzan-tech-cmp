import { transaction } from "../patchEngine.js";

const testFile = "testCashFlow.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC063 - ALIGN CASH FLOW NODE TEST");
    console.log("=========================================");

    const result = await transaction([

        {
            path: testFile,
            mode: "regex",
            search:
                'import \\{ CMPTransactionEngine \\} from "\\.\\/js\\/business\\/transactionEngine\\.js";\\s*import \\{ CMPCashFlowEngine \\} from "\\.\\/js\\/business\\/cashFlowEngine\\.js";',

            replace:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPCashFlowEngine } from "./js/business/cashFlowEngine.js";
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
    name: "FY 2026 Cash Flow Test",
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
                'const report = CMPCashFlowEngine\\.generate\\(\\);',

            replace:
`const report =
    await CMPCashFlowEngine.generate();

if (report.netCashFlow !== 10000) {

    throw new Error(
        "Unexpected net cash flow: " +
        report.netCashFlow
    );

}`
        }

    ]);

    console.log("RC063 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC063 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC063 PATCH COMPLETE");
    console.log("=========================================");
}

run();
