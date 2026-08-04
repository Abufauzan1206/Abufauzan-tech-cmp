/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: addPatchEnginePathToGeneratorPatch.js
 * Version: 1.0.0
 *
 * Add Patch Engine Path To Generator
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
        "ADD PATCH ENGINE PATH TO GENERATOR"
    );

    console.log(
        "========================================="
    );


    try {

        const result =
            await patch({

                path: file,

                search:
`REPLACE:
                    "Engineer"`

                ,

                replace:
`REPLACE:
                    "Engineer",

                PATCH_ENGINE_PATH:
                    "../patchEngine.js"`

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
