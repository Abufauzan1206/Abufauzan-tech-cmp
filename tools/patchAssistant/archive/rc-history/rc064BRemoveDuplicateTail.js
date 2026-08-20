import { transaction } from "../patchEngine.js";

const target =
    "tools/patchAssistant/rc/rc064AlignOpeningBalanceNodeTest.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC064B - REMOVE DUPLICATE RC064 TAIL");
    console.log("=========================================");

    const replacement = [
        "        }",
        "    ]);",
        "",
        '    console.log("RC064 TRANSACTION RESULT:");',
        "    console.log(JSON.stringify(result, null, 2));",
        "",
        "    if (!result.success) {",
        "        process.exitCode = 1;",
        '        console.log("=========================================");',
        '        console.log("RC064 PATCH FAIL");',
        '        console.log("=========================================");',
        "        return;",
        "    }",
        "",
        '    console.log("=========================================");',
        '    console.log("RC064 PATCH COMPLETE");',
        '    console.log("=========================================");',
        "}",
        "",
        "run();",
        ""
    ].join("\n");

    const result = await transaction([
        {
            path: target,
            mode: "regex",
            search:
                '\\n\\s+import \\{ transaction \\} from "\\.\\./patchEngine\\.js";[\\s\\S]*$',
            replace: replacement
        }
    ]);

    console.log("RC064B TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC064B REPAIR FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC064B REPAIR COMPLETE");
    console.log("=========================================");
}

run();
