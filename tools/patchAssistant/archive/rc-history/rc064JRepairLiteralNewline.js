import { transaction } from "../patchEngine.js";

const target = "testOpeningBalance.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064J - REPAIR LITERAL NEWLINE");
    console.log("=========================================");

    const result = await transaction([
        {
            path: target,
            mode: "exact",
            search: "const report =\\n    await CMPOpeningBalanceEngine.generate();",
            replace: `const report =
    await CMPOpeningBalanceEngine.generate();`
        }
    ]);

    console.log("RC064J TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064J PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064J PATCH COMPLETE");
    console.log("=========================================");
}

run();
