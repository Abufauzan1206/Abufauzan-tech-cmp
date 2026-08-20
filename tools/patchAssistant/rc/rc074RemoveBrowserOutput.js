/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC074 REMOVE BROWSER OUTPUT FROM NODE TEST
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC074 REMOVE BROWSER OUTPUT PATCH");
    console.log("=========================================");

    try {
        const result = await patch({
            path: "testAccountingPeriodReopenJournalPosting.js",
            search: "output.textContent =",
            replace: ""
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
