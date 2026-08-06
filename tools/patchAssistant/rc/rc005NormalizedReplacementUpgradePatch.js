/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #005
 *
 * File: rc005NormalizedReplacementUpgradePatch.js
 * Version: 1.0.0
 *
 * Normalized Replacement Engine Upgrade
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "tools/patchAssistant/core/replacementService.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC005 - NORMALIZED REPLACEMENT UPGRADE"
    );

    console.log(
        "========================================="
    );


    try {

        await patch({

            path: file,

            search:
`        case "normalized":

            throw new Error(
                "Whitespace-tolerant replacement is not yet implemented."
            );`,

            replace:
`        case "normalized": {

            const normalize = text =>
                text.replace(
                    /\\\\s+/g,
                    " "
                ).trim();


            const normalizedSearch =
                normalize(search);


            const normalizedContent =
                normalize(content);


            const index =
                normalizedContent.indexOf(
                    normalizedSearch
                );


            if (index === -1) {

                throw new Error(
                    "Normalized replacement target not found."
                );

            }


            const originalStart =
                content.indexOf(
                    search.trim().split(
                        /\\\\s+/
                    )[0]
                );


            if (originalStart === -1) {

                throw new Error(
                    "Unable to map normalized match."
                );

            }


            return content.replace(
                content.substring(
                    originalStart,
                    originalStart +
                    search.length
                ),
                replacement
            );

        }`
        });


        console.log(
            "PATCH: PASS"
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
