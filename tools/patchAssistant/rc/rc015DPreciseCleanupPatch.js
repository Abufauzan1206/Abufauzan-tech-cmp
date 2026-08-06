/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC015D Precise Cleanup v2
 *
 * Remove Duplicate Accounting Validator
 * =====================================================
 */

import fs from "fs";

const TARGET_FILE =
    "js/services/financialValidationService.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC015D PRECISE CLEANUP V2"
    );

    console.log(
        "========================================="
    );


    try {

        let content =
            fs.readFileSync(
                TARGET_FILE,
                "utf8"
            );
        const marker =
            "export async function validateAccountingPeriod(date)";


        const first =
            content.indexOf(
                marker
            );


        const second =
            content.indexOf(
                marker,
                first + 1
            );


        if (
            first === -1 ||
            second === -1
        ) {

            throw new Error(
                "Second validator not found."
            );

        }


        let braceCount = 0;

        let started = false;

        let endIndex = -1;


        for (
            let i = second;
            i < content.length;
            i++
        ) {

            if (
                content[i] === "{"
            ) {

                braceCount++;

                started = true;

            }


            if (
                content[i] === "}"
                && started
            ) {

                braceCount--;

            }


            if (
                started &&
                braceCount === 0
            ) {

                endIndex = i + 1;

                break;

            }

        }


        if (endIndex === -1) {

            throw new Error(
                "Could not locate validator end."
            );

        }


        content =
            content.slice(
                0,
                second
            ) +
            content.slice(
                endIndex
            );
        fs.writeFileSync(
            TARGET_FILE,
            content,
            "utf8"
        );


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
