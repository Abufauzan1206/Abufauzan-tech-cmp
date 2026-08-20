import { patch } from "../patchEngine.js";

const TARGET_FILE = "testJournalRollbackRC017H.html";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC017H ACCOUNTING PERIOD TEST REPAIR");
    console.log("=========================================");

    try {
        await patch({
            path: TARGET_FILE,
            search: `import {
    findJournalByReference
} from "./js/services/journalService.js";`,
            replace: `import {
    findJournalByReference
} from "./js/services/journalService.js";

import {
    createYear
} from "./js/business/financialYearEngine.js";

import {
    createPeriod
} from "./js/business/accountingPeriodEngine.js";`
        });

        await patch({
            path: TARGET_FILE,
            search: `        startSandbox();

        log("\\nSandbox Started: PASS");`,
            replace: `        startSandbox();

        log("\\nSandbox Started: PASS");

        const testSuffix = Date.now();

        const financialYear = await createYear({
            name:
                "FY 2026 RC017H Rollback Test " + testSuffix,
            startDate:
                "2026-01-01",
            endDate:
                "2026-12-31"
        });

        const accountingPeriod = await createPeriod({
            name:
                "August 2026 RC017H Rollback Test " + testSuffix,
            financialYearId:
                financialYear.id,
            startDate:
                "2026-08-01",
            endDate:
                "2026-08-31"
        });

        log("FINANCIAL YEAR: PASS");
        log("ACCOUNTING PERIOD: PASS");`
        });

        console.log("PATCH: PASS");
    }
    catch (error) {
        console.log("PATCH: FAIL");
        console.log(error.message);
        process.exit(1);
    }
}

run();
