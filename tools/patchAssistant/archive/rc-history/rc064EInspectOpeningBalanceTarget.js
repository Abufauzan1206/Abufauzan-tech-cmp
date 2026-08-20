import { transaction } from "../patchEngine.js";

const target = "testOpeningBalance.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064E - INSPECT OPENING BALANCE TARGET");
    console.log("=========================================");

    const result = await transaction([
        {
            path: target,
            mode: "exact",
            search: "CMPTransactionEngine.create({",
            replace: "CMPTransactionEngine.create({"
        }
    ]);

    console.log("RC064E TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064E DIAGNOSTIC FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064E DIAGNOSTIC COMPLETE");
    console.log("=========================================");
}

run();
