import { transaction } from "../patchEngine.js";

const patches = [

    {
        path:
            "tools/patchAssistant/rc/rc083ClosingJournalPostingIntegration.js",

        mode:
            "regex",

        search:
            "(mode:\\s*\"create\",\\s*)content:",

        replace:
            "$1replace:"
    }

];

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC085 - FIX RC083 CREATE CONTENT FIELD"
    );

    console.log(
        "========================================="
    );

    const result =
        await transaction(
            patches
        );

    console.log(
        "RC085 TRANSACTION RESULT:"
    );

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

    if (!result.success) {

        process.exitCode = 1;

        console.log(
            "========================================="
        );

        console.log(
            "RC085 PATCH FAIL"
        );

        console.log(
            "========================================="
        );

        return;

    }

    console.log(
        "========================================="
    );

    console.log(
        "RC085 PATCH COMPLETE"
    );

    console.log(
        "========================================="
    );

}

run();
