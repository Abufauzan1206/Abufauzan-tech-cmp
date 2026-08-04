/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: {{FILE_NAME}}
 * Version: 1.0.0
 *
 * {{DESCRIPTION}}
 * =====================================================
 */

import { patch } from "{{PATCH_ENGINE_PATH}}";

const file =
    "{{TARGET_FILE}}";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "{{TITLE}}"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                search:
`{{SEARCH}}`,

                replace:
`{{REPLACE}}`

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
