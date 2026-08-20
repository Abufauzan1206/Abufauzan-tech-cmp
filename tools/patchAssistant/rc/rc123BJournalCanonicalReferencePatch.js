import { transaction } from "../patchEngine.js";

const patches = [
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
    console.log("RC123B - JOURNAL CANONICAL REFERENCE PATCH");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC123B TRANSACTION RESULT:");
    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC123B PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC123B PATCH COMPLETE");
    console.log("=========================================");
}

run();
