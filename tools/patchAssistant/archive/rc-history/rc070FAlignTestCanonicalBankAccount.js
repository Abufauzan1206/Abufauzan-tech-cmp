import { patch } from "../patchEngine.js";

const file = "testBankBookTransactionIntegration.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070F - ALIGN TEST CANONICAL BANK ACCOUNT");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: 'if (receiptBankBook.account !== "Bank") {',
            replace: 'if (receiptBankBook.account !== "Bank Account") {'
        });

        console.log("RC070 TEST ACCOUNT ALIGNMENT: PASS");
        console.log(result);
        console.log("=========================================");
        console.log("RC070F COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
