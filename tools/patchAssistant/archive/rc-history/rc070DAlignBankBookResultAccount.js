import { patch } from "../patchEngine.js";

const file = "js/business/bankBookEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070D - ALIGN BANK BOOK RESULT ACCOUNT");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: '"Bank",',
            replace: '"Bank Account",'
        });

        console.log("BANK BOOK RESULT ACCOUNT ALIGNMENT: PASS");
        console.log(result);
        console.log("=========================================");
        console.log("RC070D COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
