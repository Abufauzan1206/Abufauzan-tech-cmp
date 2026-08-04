/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: upgradePatchServiceV11.js
 * Version: 1.1.0
 *
 * Upgrade Patch Service to v1.1
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "tools/patchAssistant/patchService.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "PATCH SERVICE UPGRADE v1.1"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                search:
`    const updated =
        content.replace(
            data.search,
            data.replace
        );`,

                replace:
`    let updated;

    if (content.includes(data.search)) {

        updated =
            content.replace(
                data.search,
                data.replace
            );

    }
    else {

        const normalize = text =>
            text.replace(/\\s+/g, " ").trim();

        if (
            normalize(content).includes(
                normalize(data.search)
            )
        ) {

            throw new Error(
                "Normalized match detected. Whitespace-tolerant replacement will be implemented in Patch Service v1.2."
            );

        }

        throw new Error(
            "Search text not found."
        );

    }`

            });

        console.log(
            "UPGRADE PATCH: PASS"
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
