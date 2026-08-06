/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #015D-Cleanup
 *
 * File: rc015DRemoveDuplicatePatch.js
 * Version: 1.0.0
 *
 * Remove Duplicate Accounting Period Validator
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
        "RC015D CLEANUP - REMOVE DUPLICATE"
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
`export async function validateAccountingPeriod(date) {`;


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
                "Duplicate validator not found."
            );

        }


        const end =
            content.indexOf(
                "\n}",
                second
            ) + 2;


        content =
            content.slice(
                0,
                second
            ) +
            content.slice(
                end
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
