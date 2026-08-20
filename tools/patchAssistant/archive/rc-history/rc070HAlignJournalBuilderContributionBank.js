import { patch } from "../patchEngine.js";

const file = "js/business/journalBuilderEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070H - ALIGN JOURNAL BUILDER CONTRIBUTION BANK");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: '"Cash Account"',
            replace: '"Bank Account"'
        });

        console.log("JOURNAL BUILDER CONTRIBUTION BANK ALIGNMENT: PASS");
        console.log(result);
        console.log("=========================================");
        console.log("RC070H COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
