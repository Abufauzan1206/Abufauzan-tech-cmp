import { patch } from "../patchEngine.js";

const file =
    "tools/patchAssistant/rc/rc070BankBookTransactionIntegration.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070A - REPAIR RC070 PATCH SYNTAX");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: 'console.log(\\`Test: \\${path}\\`);',
            replace: 'console.log("Test: " + path);'
        });

        console.log("RC070 PATCH SYNTAX REPAIR: PASS");
        console.log(result);
        console.log("=========================================");
        console.log("RC070A COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
