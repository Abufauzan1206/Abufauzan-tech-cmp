import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "js/business/journalBuilderEngine.js",
        mode: "regex",
        search: String.raw`(case\s+"CONTRIBUTION":\s*return\s*\{[\s\S]*?reference:\s*)transaction\.transactionId`,
        replace: `$1(transaction.reference ?? transaction.transactionId)`
    },

    {
        path: "js/business/journalBuilderEngine.js",
        mode: "regex",
        search: String.raw`(case\s+"EXPENSE":\s*return\s*\{[\s\S]*?reference:\s*)transaction\.transactionId`,
        replace: `$1(transaction.reference ?? transaction.transactionId)`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC123A - CANONICAL TRANSACTION REFERENCE PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC123A TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC123A PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC123A PATCH COMPLETE");
    console.log("=========================================");
}

run();
