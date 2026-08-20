import { patch } from "../patchEngine.js";

const file = "js/business/bankBookEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070B - ALIGN BANK BOOK CANONICAL ACCOUNT");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: 'await generateGeneralLedger("Bank");',
            replace: 'await generateGeneralLedger("Bank Account");'
        });

        console.log("BANK BOOK LEDGER ACCOUNT ALIGNMENT: PASS");
        console.log(result);

        const result2 = await patch({
            path: file,
            search: 'account: "Bank",',
            replace: 'account: "Bank Account",'
        });

        console.log("BANK BOOK RESULT ACCOUNT ALIGNMENT: PASS");
        console.log(result2);

        console.log("=========================================");
        console.log("RC070B COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.error("PATCH FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
