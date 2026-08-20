import { patch } from "../patchEngine.js";

const file = "testBankBookTransactionIntegration.js";

async function run() {
    try {
        await patch({
            path: file,
            mode: "regex",
            search: 'amount: 10000,\\\\n\\s*account: "Bank Account",',
            replace: 'amount: 10000,\n            account: "Bank Account",'
        });

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC071B - REPAIR LITERAL NEWLINE");
        console.log("=========================================");
        console.log("PATCH: PASS");
    } catch (error) {
        console.error("RC071B PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
