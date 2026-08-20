import { transaction } from "../patchEngine.js";

const file =
    "js/business/closingJournalEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC044 - CLOSING JOURNAL ACCOUNT ALIGNMENT");
    console.log("=========================================");

    const result = await transaction([

        {
            path: file,
            mode: "regex",

            search:
                'account:\\s*"Current Surplus"',

            replace:
                'account: "Contribution Income"'
        },

        {
            path: file,
            mode: "regex",

            search:
                'account:\\s*"Retained Earnings"',

            replace:
                'account: "Members Capital"'
        },

        {
            path: file,
            mode: "regex",

            search:
                'account:\\s*"Current Deficit"',

            replace:
                'account: "Office Expense"'
        }

    ]);

    console.log("RC044 TRANSACTION RESULT:");
    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {

        process.exitCode = 1;
        return;

    }

    console.log("=========================================");
    console.log("RC044 PATCH COMPLETE");
    console.log("=========================================");

}

run();
