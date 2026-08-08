import {
    patch
} from "../patchEngine.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "RC017B LEDGER REFERENCE PERSISTENCE PATCH"
    );

    console.log(
        "========================================="
    );


    const result =
        await patch({

            path:
                "js/business/ledgerBatchPostingEngine.js",

            search:
`        entries,

        ...(options.sandboxId
            ? {
                sandboxId:
                    options.sandboxId
            }
            : {}),`,

            replace:
`        entries,

        ...(options.journalReference
            ? {
                journalReference:
                    options.journalReference
            }
            : {}),

        ...(options.sandboxId
            ? {
                sandboxId:
                    options.sandboxId
            }
            : {}),`

        });


    console.log(
        "PATCH: PASS"
    );

    console.log(
        JSON.stringify(result,null,4)
    );

}

run();
