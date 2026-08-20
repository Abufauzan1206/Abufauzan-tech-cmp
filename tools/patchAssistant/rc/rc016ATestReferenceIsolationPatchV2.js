import { patch } from "../patchEngine.js";

const TARGET_FILE = "testDuplicateJournalRC016A.html";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC016A TEST REFERENCE ISOLATION PATCH V2");
    console.log("=========================================");

    try {
        const result = await patch({
            path: TARGET_FILE,
            ignoreWhitespace: true,

            search:
`startSandbox();`,

            replace:
`startSandbox();

        const reference =
            "RC016A-REF-" + Date.now();`
        });

        console.log("PATCH: PASS");
        console.log(JSON.stringify(result, null, 4));
    }
    catch (error) {
        console.log("PATCH: FAIL");
        console.log(error.message);
        process.exit(1);
    }
}

run();
