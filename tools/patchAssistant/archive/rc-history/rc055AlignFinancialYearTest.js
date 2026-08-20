import { transaction } from "../patchEngine.js";

const testFile = "testFinancialYear.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC055 - ALIGN FINANCIAL YEAR TEST");
    console.log("=========================================");

    const result = await transaction([
        {
            path: testFile,
            mode: "regex",
            search:
                'import \\{ CMPFinancialYearEngine \\} from "\\.\\/js\\/business\\/financialYearEngine\\.js";',
            replace:
                `import {
    createYear,
    closeYear,
    reopenYear
} from "./js/business/financialYearEngine.js";
import {
    getFinancialYearById
} from "./js/services/financialYearService.js";`
        },
        {
            path: testFile,
            mode: "regex",
            search:
                'console\\.log\\(" ABUFAUZAN TECH CMP"\\);',
            replace:
                `console.log(" ABUFAUZAN TECH CMP");

const financialYear = await createYear({
    name: "FY 2026 Financial Year Test",
    startDate: "2026-01-01",
    endDate: "2026-12-31"
});

const yearId = financialYear.id;

const closeReport = await closeYear(yearId);`
        },
        {
            path: testFile,
            mode: "regex",
            search:
                'const closeReport = CMPFinancialYearEngine\\.close\\(2026\\);',
            replace:
                `const closedYear = await getFinancialYearById(yearId);`
        },
        {
            path: testFile,
            mode: "regex",
            search:
                'console\\.log\\(closeReport\\);',
            replace:
                `console.log(closeReport);
console.log("Closed Status:", closedYear.status);`
        },
        {
            path: testFile,
            mode: "regex",
            search:
                'console\\.log\\(CMPFinancialYearEngine\\.isClosed\\(2026\\)\\);',
            replace:
                `console.log(closedYear.status === "CLOSED");`
        },
        {
            path: testFile,
            mode: "regex",
            search:
                'const reopenReport = CMPFinancialYearEngine\\.reopen\\(2026\\);',
            replace:
                `const reopenReport = await reopenYear(yearId);`
        },
        {
            path: testFile,
            mode: "regex",
            search:
                'console\\.log\\(CMPFinancialYearEngine\\.isClosed\\(2026\\)\\);',
            replace:
                `const reopenedYear = await getFinancialYearById(yearId);
console.log(reopenedYear.status === "CLOSED");`
        }
    ]);

    console.log("RC055 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC055 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC055 PATCH COMPLETE");
    console.log("=========================================");
}

run();
