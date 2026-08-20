import { patch } from "../patchEngine.js";

const file =
    "testAccountingPeriodReopenJournalPosting.html";

async function run() {
    try {
        await patch({
            path: file,
            mode: "regex",
            search:
                'report\\s*\\+=\\s*"\\\\\\\\n--- PERIOD CONTEXT DIAGNOSTIC ---\\\\\\\\n";[\\s\\S]*?report\\s*\\+=\\s*"Returned Journal Accounting Period ID:\\s*"\\s*\\+[\\s\\S]*?"\\\\\\\\n";',
            replace: ""
        });

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC075B - CLEANUP PERIOD CONTEXT DIAGNOSTIC");
        console.log("=========================================");
        console.log("PATCH: PASS");
    } catch (error) {
        console.error("RC075B PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
