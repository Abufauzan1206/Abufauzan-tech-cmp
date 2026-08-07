/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC016A - Duplicate Journal Protection
 *
 * File:
 * rc016DuplicateJournalProtectionPatch.js
 *
 * Version: 1.0.0
 * =====================================================
 */

import fs from "fs";

const TARGET_FILE =
    "js/business/journalPostingEngine.js";


async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC016A - DUPLICATE JOURNAL PROTECTION"
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
        const importMarker =
`import {
    validateEntries,
    validateAccountingPeriod
} from "../services/financialValidationService.js";`;

        const newImport =
`${importMarker}

import {
    findJournalByReference
} from "../services/journalService.js";`;

        if (
            content.includes(importMarker) &&
            !content.includes("findJournalByReference")
        ) {

            content =
                content.replace(
                    importMarker,
                    newImport
                );

        }


        const validationMarker =
`    await validateEntries(
        entries
    );`;

        const duplicateCheck =
`${validationMarker}

    if (data.reference) {

        const existing =
            await findJournalByReference(
                data.reference
            );

        if (existing) {

            throw new Error(
                "Duplicate journal reference detected."
            );

        }

    }`;

        if (
            content.includes(validationMarker) &&
            !content.includes("Duplicate journal reference detected.")
        ) {

            content =
                content.replace(
                    validationMarker,
                    duplicateCheck
                );

        }
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
