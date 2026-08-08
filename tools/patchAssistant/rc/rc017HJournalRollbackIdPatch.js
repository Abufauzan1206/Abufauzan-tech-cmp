/**
 * =========================================
 * ABUFAUZAN TECH CMP
 * RC017H JOURNAL ROLLBACK ID PATCH
 * =========================================
 */

import { patch } from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC017H JOURNAL ROLLBACK ID PATCH");
    console.log("=========================================");

    try {

        const result = await patch({

            path:
                "js/business/journalPostingEngine.js",

            ignoreWhitespace: true,

            search:
`    if (journalResult?.id) {

        await deleteJournal(
            journalResult.id
        );

    }`,

            replace:
`    if (journalResult) {

        await deleteJournal(
            journalResult.id ??
            journalResult
        );

    }`

        });

        console.log("PATCH: PASS");
        console.log(
            JSON.stringify(
                result,
                null,
                4
            )
        );

    }
    catch (error) {

        console.log("PATCH: FAIL");
        console.log(error.message);

    }

}

run();
