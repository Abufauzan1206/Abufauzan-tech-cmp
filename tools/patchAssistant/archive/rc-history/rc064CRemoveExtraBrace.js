import { transaction } from "../patchEngine.js";

const target =
    "tools/patchAssistant/rc/rc064AlignOpeningBalanceNodeTest.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064C - REMOVE EXTRA CLOSING BRACE");
    console.log("=========================================");

    const result = await transaction([
        {
            path: target,
            mode: "exact",
            search: "        }        }\n    ]);",
            replace: "        }\n    ]);"
        }
    ]);

    console.log("RC064C TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064C PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064C PATCH COMPLETE");
    console.log("=========================================");
}

run();
