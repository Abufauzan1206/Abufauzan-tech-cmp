import { patch } from "../patchEngine.js";

const file = "testAccountingPeriodLifecycleEngine.html";

async function run() {
    try {
        await patch({
            path: file,
            mode: "regex",
            search: 'import \\{ createPeriod,\\s*createYear,\\s*closePeriod,\\s*lockPeriod,\\s*unlockPeriod,\\s*reopenPeriod\\s*\\} from "\\./js/business/accountingPeriodEngine\\.js";',
            replace: `import {
    createPeriod,
    closePeriod,
    lockPeriod,
    unlockPeriod,
    reopenPeriod
} from "./js/business/accountingPeriodEngine.js";

import { createYear } from "./js/business/financialYearEngine.js";`
        });

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC072 - FIX ACCOUNTING PERIOD LIFECYCLE IMPORT");
        console.log("=========================================");
        console.log("PATCH: PASS");
    } catch (error) {
        console.error("RC072 PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
