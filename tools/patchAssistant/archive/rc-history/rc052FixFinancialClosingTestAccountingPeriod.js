import { transaction } from "../patchEngine.js";

const testFile = "testFinancialClosingCoordinator.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC052 - FIX FINANCIAL CLOSING TEST ACCOUNTING PERIOD");
    console.log("=========================================");

    const result = await transaction([
        {
            path: testFile,
            mode: "regex",
            search:
                'import \\{ CMPTransactionEngine \\} from "\\.\\/js\\/business\\/transactionEngine\\.js";',
            replace:
`import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";`
        },

        {
            path: testFile,
            mode: "regex",
            search:
                'await CMPTransactionEngine\\.create\\(\\{\\s*type:\\s*"CONTRIBUTION",\\s*amount:\\s*10000,\\s*description:\\s*"Monthly Contribution"\\s*\\}\\);\\s*\\s*const financialYear',
            replace:
`const financialYear`
        },

        {
            path: testFile,
            mode: "regex",
            search:
                'endDate:\\s*"2026-12-31"\\s*\\}\\);\\s*const report',
            replace:
`endDate: "2026-12-31"
});

const accountingPeriod = await createPeriod({
    name: "August 2026",
    financialYearId: financialYear.id,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
});

await CMPTransactionEngine.create({
    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"
});

const report`
        }
    ]);

    console.log("RC052 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC052 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC052 PATCH COMPLETE");
    console.log("=========================================");
}

run();
