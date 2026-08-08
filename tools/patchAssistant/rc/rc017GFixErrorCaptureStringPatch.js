import {
    patch
} from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("RC017G FIX ERROR CAPTURE STRING");
    console.log("=========================================");

    const result = await patch({

        path:
            "testLedgerDuplicateRC017A.html",

        ignoreWhitespace: true,

        search:
`output.textContent =
        "FATAL ERROR

" +
        error.stack;`,

        replace:
`output.textContent =
        "FATAL ERROR\\n\\n" +
        error.stack;`

    });

    console.log("PATCH: PASS");
    console.log(JSON.stringify(result, null, 4));

}

run();
