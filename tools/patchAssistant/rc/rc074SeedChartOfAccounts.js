/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC074 SEED CHART OF ACCOUNTS
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC074 SEED CHART OF ACCOUNTS PATCH");
    console.log("=========================================");

    try {
        const result = await patch({
            path: "testAccountingPeriodReopenJournalPosting.js",

            search: `import {
    postJournal
} from "./js/business/journalPostingEngine.js";`,

            replace: `import {
    postJournal
} from "./js/business/journalPostingEngine.js";

import {
    seedChartOfAccounts
} from "./js/seeders/chartOfAccountsSeeder.js";`,

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
