import { patch } from "../patchEngine.js";

const file = "testAccountingPeriodLifecycleEngine.html";

async function run() {
    try {
        await patch({
            path: file,
            mode: "regex",
            search: 'import \\{ createYear \\} from "\\./js/business/financialYearEngine\\.js";',
            replace: `import { createYear } from "./js/business/financialYearEngine.js";
import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";`
        });

        await patch({
            path: file,
            mode: "regex",
            search: 'const output = document\\.getElementById\\("output"\\);',
            replace: `CMPMemoryAdapter.clear();

const output = document.getElementById("output");`
        });

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC073 - ISOLATE ACCOUNTING PERIOD LIFECYCLE TEST");
        console.log("=========================================");
        console.log("PATCH: PASS");
    } catch (error) {
        console.error("RC073 PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
