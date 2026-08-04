/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: makePatch.js
 * Version: 1.0.0
 *
 * Patch Generator Command
 * =====================================================
 */

import { generateFromTemplate }
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

};


async function run() {

    const result =
        await generateFromTemplate(

            "./tools/codeGenerator/templates/patch.template.js",

            "./tools/patchAssistant/test/generatedPatch.js",

            {

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

        );


    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "PATCH GENERATOR"
    );

    console.log(
        "========================================="
    );


    console.log(result);

}


run();
