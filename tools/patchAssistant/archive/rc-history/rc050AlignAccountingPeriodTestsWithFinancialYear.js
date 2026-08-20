import { transaction } from "../patchEngine.js";

const files = {
    core: "testFinancialCore.js",
    engine: "testAccountingPeriodEngine.html",
    lifecycle: "testAccountingPeriodLifecycleEngine.html"
};

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC050 - ALIGN ACCOUNTING PERIOD TESTS");
    console.log("=========================================");

    const result = await transaction([
        {
            path: files.core,
            mode: "regex",
            search:
                'import \\{ createPeriod \\} from "\\./js/business/accountingPeriodEngine\\.js";',
            replace:
`import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";`
        },
        {
            path: files.core,
            mode: "regex",
            search:
                'const seedResult = await seedChartOfAccounts\\(\\);',
            replace:
`const seedResult = await seedChartOfAccounts();

const financialYear = await createYear({
    name: "FY 2026 Financial Core Test",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z"
});`
        },
        {
            path: files.core,
            mode: "regex",
            search:
                'name: "2026",\\s*startDate: "2026-01-01T00:00:00\\.000Z",\\s*endDate: "2026-12-31T23:59:59\\.999Z"',
            replace:
`name: "2026",
        financialYearId: financialYear.id,
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-12-31T23:59:59.999Z"`
        },
        {
            path: files.engine,
            mode: "regex",
            search:
                'import \\{\\s*createPeriod\\s*\\} from "\\./js/business/accountingPeriodEngine\\.js";',
            replace:
`import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import { createYear } from "./js/business/financialYearEngine.js";`
        },
        {
            path: files.engine,
            mode: "regex",
            search:
                'try \\{\\s*report \\+= "=========================================\\\\n";',
            replace:
`try {
        const financialYear = await createYear({
            name: "FY 2026 Accounting Period Engine Test",
            startDate: "2026-01-01",
            endDate: "2026-12-31"
        });

        report += "=========================================\\n";`
        },
        {
            path: files.engine,
            mode: "regex",
            search:
                'name: "August 2026",\\s*startDate: "2026-08-01",\\s*endDate: "2026-08-31"',
            replace:
`name: "August 2026",
            financialYearId: financialYear.id,
            startDate: "2026-08-01",
            endDate: "2026-08-31"`
        },
        {
            path: files.lifecycle,
            mode: "regex",
            search:
                'import \\{\\s*createPeriod,',
            replace:
`import { createPeriod,
    createYear,`
        },
        {
            path: files.lifecycle,
            mode: "regex",
            search:
                'try \\{\\s*report \\+= "=========================================\\\\n";',
            replace:
`try {
        const financialYear = await createYear({
            name: "FY 2026 Accounting Period Lifecycle Test",
            startDate: "2026-01-01",
            endDate: "2026-12-31"
        });

        report += "=========================================\\n";`
        },
        {
            path: files.lifecycle,
            mode: "regex",
            search:
                'name: "September 2026",\\s*startDate: "2026-09-01",\\s*endDate: "2026-09-30"',
            replace:
`name: "September 2026",
            financialYearId: financialYear.id,
            startDate: "2026-09-01",
            endDate: "2026-09-30"`
        }
    ]);

    console.log("RC050 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC050 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC050 PATCH COMPLETE");
    console.log("=========================================");
}

run();
