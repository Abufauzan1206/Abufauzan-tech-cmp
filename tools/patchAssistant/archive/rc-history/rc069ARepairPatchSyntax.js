import { patch } from "../patchEngine.js";

const file =
    "tools/patchAssistant/rc/rc069GeneralLedgerTransactionIntegration.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC069A - REPAIR RC069 PATCH SYNTAX");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: 'console.log(\\`Test: \\${path}\\`);',
            replace: 'console.log("Test: " + path);'
        });

        console.log("RC069 PATCH SYNTAX REPAIR: PASS");
        console.log(result);
        console.log("=========================================");
        console.log("RC069A COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
