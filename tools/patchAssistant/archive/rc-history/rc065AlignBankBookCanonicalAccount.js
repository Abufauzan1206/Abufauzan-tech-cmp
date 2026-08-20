import { patch } from "../patchEngine.js";

const file = "js/business/bankBookEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC065 - ALIGN BANK BOOK CANONICAL ACCOUNT");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: `await generateGeneralLedger("Bank Account");`,
            replace: `await generateGeneralLedger("Bank");`
        });

        console.log("BANK BOOK ACCOUNT ALIGNMENT: PASS");
        console.log(result);

        console.log("=========================================");
        console.log("RC065 COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
