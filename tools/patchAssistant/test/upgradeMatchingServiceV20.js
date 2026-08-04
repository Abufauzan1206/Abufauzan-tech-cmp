/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: upgradeMatchingServiceV20.js
 * Version: 2.0.0
 *
 * Upgrade Matching Service Strategy API
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "tools/patchAssistant/core/matchingService.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "UPGRADE MATCHING SERVICE"
    );

    console.log(
        "========================================="
    );

    try {

        let result;

        result = await patch({

            path: file,

            search:
`            found: true,

            search`,

            replace:
`            found: true,

            strategy: "exact",

            search`

        });

        console.log(
            "EXACT STRATEGY PATCH: PASS"
        );

        console.log(result);


        result = await patch({

            path: file,

            search:
`            found: true,

            normalized: true,

            search`,

            replace:
`            found: true,

            strategy: "normalized",

            search`

        });

        console.log(
            "NORMALIZED STRATEGY PATCH: PASS"
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
