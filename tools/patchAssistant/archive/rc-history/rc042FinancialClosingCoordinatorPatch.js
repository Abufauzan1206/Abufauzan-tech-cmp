import { transaction } from "../patchEngine.js";

const file =
    "js/business/financialClosingCoordinator.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC042 - FINANCIAL CLOSING COORDINATOR");
    console.log("=========================================");

    try {

        const result =
            await transaction([

                {
                    path: file,

                    mode: "regex",

                    search:
                        'import\\s*\\{\\s*CMPClosingJournalEngine\\s*\\}\\s*from\\s*"\\.\\/closingJournalEngine\\.js";',

                    replace:
`import { CMPClosingJournalEngine }
from "./closingJournalEngine.js";

import {
    postClosingJournal
}
from "./closingJournalPostingEngine.js";`
                },

                {
                    path: file,

                    mode: "regex",

                    search:
                        'const\\s+closingJournal\\s*=\\s*await\\s+CMPClosingJournalEngine\\.generate\\(\\);',

                    replace:
`const closingJournal =
            await CMPClosingJournalEngine.generate();

        const closingPosting =
            await postClosingJournal(
                new Date().toISOString().split("T")[0]
            );`
                },

                {
                    path: file,

                    mode: "regex",

                    search:
                        'closingJournal,\\s*openingBalance,',

                    replace:
`closingJournal,

            closingPosting,

            openingBalance,`
                }

            ]);

        console.log(
            "RC042 TRANSACTION RESULT:"
        );

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

        if (!result.success) {

            process.exitCode = 1;
            return;

        }

        console.log("=========================================");
        console.log("RC042 PATCH COMPLETE");
        console.log("=========================================");

    }
    catch (error) {

        console.log("RC042 PATCH FAIL");

        console.log(error.message);

        process.exitCode = 1;

    }

}

run();
