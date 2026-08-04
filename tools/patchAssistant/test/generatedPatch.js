/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: generatedPatch.js
 * Version: 1.0.0
 *
 * Generated Patch Script
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "sample.txt";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "GENERATED PATCH"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                search:
`Developer`,

                replace:
`Engineer`

            });

        console.log(
            "PATCH: PASS"
        );

        console.log(
            result
        );

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
