import {
    patch
} from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("RC017E REPLACE REMAINING TEST REFERENCE");
    console.log("=========================================");

    const result = await patch({

        path:
            "testLedgerDuplicateRC017A.html",

        search:
`                        "RC017A-LEDGER-001"`,

        replace:
`                        testReference`

    });

    console.log("PATCH: PASS");
    console.log(JSON.stringify(result, null, 4));
}

run();
