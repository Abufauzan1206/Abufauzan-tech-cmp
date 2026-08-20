import { transaction } from "../patchEngine.js";

const patches = [

    // =====================================================
    // RC123A
    // CANONICAL TRANSACTION → JOURNAL REFERENCE
    //
    // Journal reference must use the transaction's
    // canonical reference when supplied.
    //
    // transactionId remains the internal transaction
    // identifier and is retained on journal entries.
    // =====================================================

    {
        path: "js/business/journalBuilderEngine.js",
        mode: "regex",
        search: String.raw`reference:\s*transaction\.transactionId,`,
        replace: `reference:
                transaction.reference ?? transaction.transactionId,`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC123A - CANONICAL JOURNAL REFERENCE PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC123A TRANSACTION RESULT:");
    console.log(
        JSON.stringify(result, null, 2)
    );

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
