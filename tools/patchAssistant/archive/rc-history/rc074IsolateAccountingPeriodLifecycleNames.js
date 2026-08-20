import { patch } from "../patchEngine.js";

const file = "testAccountingPeriodLifecycleEngine.html";

async function run() {
    try {
        await patch({
            path: file,
            mode: "regex",
            search: 'let report = "";',
            replace: `const testSuffix = Date.now();

let report = "";`
        });

        await patch({
            path: file,
            mode: "regex",
            search: 'name: "FY 2026 Accounting Period Lifecycle Test",',
            replace: 'name: \`FY 2026 Accounting Period Lifecycle Test \${testSuffix}\`,'
        });

        await patch({
            path: file,
            mode: "regex",
            search: 'name: "September 2026",',
            replace: 'name: \`September 2026 Lifecycle Test \${testSuffix}\`,'
        });

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC074 - ISOLATE ACCOUNTING PERIOD LIFECYCLE NAMES");
        console.log("=========================================");
        console.log("PATCH: PASS");
    } catch (error) {
        console.error("RC074 PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
