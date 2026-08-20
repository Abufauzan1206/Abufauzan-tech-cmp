import { transaction } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064M - REMOVE ACCIDENTAL SHELL FILES");
    console.log("=========================================");

    const result = await transaction([
        {
            path: "earch:",
            mode: "delete"
        },
        {
            path: "s.exitCode = 1",
            mode: "delete"
        },
        {
            path: "t file =",
            mode: "delete"
        },
        {
            path: "tatus --short",
            mode: "delete"
        }
    ]);

    console.log("RC064M TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064M PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064M PATCH COMPLETE");
    console.log("=========================================");
}

run();
