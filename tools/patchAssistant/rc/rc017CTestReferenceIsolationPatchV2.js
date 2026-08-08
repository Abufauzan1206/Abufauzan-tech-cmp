import {
    patch
} from "../patchEngine.js";

async function run() {

    console.log("=========================================");
    console.log("RC017C TEST REFERENCE ISOLATION PATCH V2");
    console.log("=========================================");

    const result = await patch({

        path:
            "testLedgerDuplicateRC017A.html",

        search:
`    try {

        startSandbox();`,

        replace:
`    try {

        const testReference =
            "RC017A-LEDGER-" + Date.now();

        startSandbox();`

    });

    console.log("PATCH: PASS");
    console.log(JSON.stringify(result, null, 4));
}

run();
