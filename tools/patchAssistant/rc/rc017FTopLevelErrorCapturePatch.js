import {
    patch
} from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("RC017F TOP LEVEL ERROR CAPTURE PATCH");
    console.log("=========================================");

    const result = await patch({

        path:
            "testLedgerDuplicateRC017A.html",

        search:
`run();`,

        replace:
`run().catch(error => {

    output.textContent =
        "FATAL ERROR\n\n" +
        error.stack;

});`

    });

    console.log("PATCH: PASS");
    console.log(JSON.stringify(result, null, 4));

}

run();
