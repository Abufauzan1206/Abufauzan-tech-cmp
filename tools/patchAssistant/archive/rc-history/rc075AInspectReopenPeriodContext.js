import { patch } from "../patchEngine.js";

const file =
    "testAccountingPeriodReopenJournalPosting.html";

async function run() {

    try {

        await patch({
            path: file,
            mode: "regex",

            search:
                'report\\s*\\+=\\s*"POST AFTER REOPEN: PASS\\\\n";',

            replace:
                `report +=
        "POST AFTER REOPEN: PASS\\\\n";

    report +=
        "\\\\n--- PERIOD CONTEXT DIAGNOSTIC ---\\\\n";

    report +=
        "Financial Year ID expected: " +
        financialYear.id +
        "\\\\n";

    report +=
        "Period ID expected: " +
        period.id +
        "\\\\n";

    report +=
        "Returned Journal Financial Year ID: " +
        String(resumedJournal.financialYearId) +
        "\\\\n";

    report +=
        "Returned Journal Accounting Period ID: " +
        String(resumedJournal.accountingPeriodId) +
        "\\\\n";`
        });

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC075A - INSPECT REOPEN PERIOD CONTEXT");
        console.log("=========================================");
        console.log("PATCH: PASS");

    } catch (error) {

        console.error("RC075A PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;

    }
}

run();
