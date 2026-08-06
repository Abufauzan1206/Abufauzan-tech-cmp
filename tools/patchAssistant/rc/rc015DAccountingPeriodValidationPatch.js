/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #015D
 *
 * File: rc015DAccountingPeriodValidationPatch.js
 * Version: 1.0.0
 *
 * Accounting Period Validation
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
        "RC015D - ACCOUNTING PERIOD VALIDATION"
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
        const target =
`    return true;

}`;


        const replacement =
`    return true;

}


export async function validateAccountingPeriod(date) {

    const period =
        await getAccountingPeriodByDate(
            date
        );


    if (!period) {

        throw new Error(
            "Accounting period not found."
        );

    }


    if (
        period.status &&
        period.status !== "OPEN"
    ) {

        throw new Error(
            "Accounting period is closed."
        );

    }


    return period;

}`;


        if (!content.includes(target)) {

            throw new Error(
                "Insertion point not found."
            );

        }


        content =
            content.replace(
                target,
                replacement
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
