/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: updatePatchTemplateImportPathPatch.js
 * Version: 1.0.0
 *
 * Update Patch Template Import Path
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "tools/codeGenerator/templates/patch.template.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "UPDATE PATCH TEMPLATE IMPORT PATH"
    );

    console.log(
        "========================================="
    );


    try {

        const result =
            await patch({

                path: file,

                search:
`import { patch } from "../patchAssistant/patchEngine.js";`,

                replace:
`import { patch } from "{{PATCH_ENGINE_PATH}}";`

            });


        console.log(
            "PATCH: PASS"
        );

        console.log(result);

    }
    catch(error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}


run();
