import { transaction } from "../patchEngine.js";

const target = "testOpeningBalance.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064I - ALIGN OPENING BALANCE GENERATION");
    console.log("=========================================");

    const result = await transaction([
        {
            path: target,
            mode: "regex",
            search: "const report =\\s*CMPOpeningBalanceEngine\\.generate\\(\\);",
            replace: "const report =\\n    await CMPOpeningBalanceEngine.generate();"
        }
    ]);

    console.log("RC064I TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064I PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064I PATCH COMPLETE");
    console.log("=========================================");
}

run();
