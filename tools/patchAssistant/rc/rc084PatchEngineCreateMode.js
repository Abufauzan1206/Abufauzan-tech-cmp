import { transaction } from "../patchEngine.js";

const patches = [

    {
        path:
            "tools/patchAssistant/patchService.js",

        mode:
            "regex",

        search:
`(\\s*)if \\(!exists\\) \\{\\s*throw new Error\\(\\s*"Target file does not exist\\."\\s*\\);\\s*\\}\\s*(const content\\s*=\\s*await repository\\.readFile\\(\\s*data\\.path\\s*\\);)`,

        replace:
`$1if (data.mode === "create") {

        if (exists) {

            throw new Error(
                "Target file already exists."
            );

        }

        await repository.writeFile(
            data.path,
            data.replace
        );

        return {
            success: true,
            backup: null,
            strategy: "create"
        };

    }

    if (!exists) {

        throw new Error(
            "Target file does not exist."
        );
    }

    $2`
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
        "RC084 - PATCH ENGINE CREATE MODE"
    );

    console.log(
        "========================================="
    );

    const result =
        await transaction(
            patches
        );

    console.log(
        "RC084 TRANSACTION RESULT:"
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
            "RC084 PATCH FAIL"
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
        "RC084 PATCH COMPLETE"
    );

    console.log(
        "========================================="
    );

}

run();
