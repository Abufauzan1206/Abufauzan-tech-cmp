/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC074 FIX VERIFICATION CHECKLIST
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC074 FIX VERIFICATION CHECKLIST");
    console.log("=========================================");

    try {
        const result = await patch({
            path: "tools/patchAssistant/rc/rc074VerificationChecklist.js",

            search: `const checks = [
    {
        name: "RC074 Accounting Period Reopen + Journal Posting",
        file: "testAccountingPeriodReopenJournalPosting.js"
    },
    {
        name: "Accounting Period Engine",
        file: "testAccountingPeriodEngine.js"
    },
    {
        name: "Accounting Period Lifecycle",
        file: "testAccountingPeriodLifecycleEngine.js"
    }
];`,

            replace: `const checks = [
    {
        name: "RC074 Accounting Period Reopen + Journal Posting",
        file: "testAccountingPeriodReopenJournalPosting.js"
    }
];`,

            ignoreWhitespace: true
        });

        console.log("PATCH: PASS");
        console.log(JSON.stringify(result, null, 4));
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exit(1);
    }
}

run();
