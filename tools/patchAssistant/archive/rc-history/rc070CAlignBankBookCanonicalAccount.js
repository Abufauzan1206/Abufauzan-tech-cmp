import { patch } from "../patchEngine.js";

const file = "js/business/bankBookEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070C - ALIGN BANK BOOK CANONICAL ACCOUNT");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: 'await generateGeneralLedger("Cash Account");',
            replace: 'await generateGeneralLedger("Bank Account");'
        });

        console.log("BANK BOOK LEDGER ACCOUNT ALIGNMENT: PASS");
        console.log(result);
        console.log("=========================================");
        console.log("RC070C COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
