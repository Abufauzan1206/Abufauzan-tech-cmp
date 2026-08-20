import { patch } from "../patchEngine.js";

const file = "js/business/journalBuilderEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070G - ALIGN JOURNAL BUILDER CONTRIBUTION BANK");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: `"Cash Account",
                            debit:
                                transaction.amount,`,
            replace: `"Bank Account",
                            debit:
                                transaction.amount,`
        });

        console.log("JOURNAL BUILDER BANK ACCOUNT ALIGNMENT: PASS");
        console.log(result);
        console.log("=========================================");
        console.log("RC070G COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
