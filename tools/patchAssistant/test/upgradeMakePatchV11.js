/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: upgradeMakePatchV11.js
 * Version: 1.1.0
 *
 * Upgrade makePatch.js to Configuration Architecture
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "tools/codeGenerator/makePatch.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "UPGRADE MAKEPATCH V1.1"
    );

    console.log(
        "========================================="
    );


    try {

        const result =
            await patch({

                path: file,

                search:
`import { generateFromTemplate }
    from "./generator.js";`,

                replace:
`import { generateFromTemplate }
    from "./generator.js";


const patchConfig = {

    template:
        "./tools/codeGenerator/templates/patch.template.js",

    output:
        "./tools/patchAssistant/test/generatedPatch.js",

    replacements: {

        FILE_NAME:
            "generatedPatch.js",

        DESCRIPTION:
            "Generated Patch Script",

        TITLE:
            "GENERATED PATCH",

        TARGET_FILE:
            "sample.txt",

        SEARCH:
            "Developer",

        REPLACE:
            "Engineer",

        PATCH_ENGINE_PATH:
            "../patchEngine.js"

    }

};`

            });


        console.log(
            "PATCH: PASS"
        );

        console.log(result);

    }
    catch (error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}

run();
