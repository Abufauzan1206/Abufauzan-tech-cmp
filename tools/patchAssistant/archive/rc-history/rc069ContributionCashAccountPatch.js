import { patch } from "../patchEngine.js";

const file = "js/business/journalBuilderEngine.js";

async function run() {
    try {
        await patch({
            path: file,
            search: `account:
                                "Bank Account",`,
            replace: `account:
                                "Cash Account",`
        });

        console.log("=========================================");
        console.log("ABUFAUZAN TECH CMP");
        console.log("RC069 - CONTRIBUTION CASH ACCOUNT PATCH");
        console.log("=========================================");
        console.log("PATCH: PASS");
    } catch (error) {
        console.error("PATCH: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

run();
