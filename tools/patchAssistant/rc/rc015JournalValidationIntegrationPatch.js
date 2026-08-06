/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #015B
 *
 * File: rc015JournalValidationIntegrationPatch.js
 * Version: 1.0.0
 *
 * Journal Validation Integration
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
        "RC015B - JOURNAL VALIDATION INTEGRATION"
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


        const importTarget =
`import {
    getAccountByName
} from "../services/chartOfAccountsService.js";`;


        const importReplacement =
`import {
    getAccountByName
} from "../services/chartOfAccountsService.js";

import {
    validateEntries
} from "../services/financialValidationService.js";`;


        if (!content.includes(importTarget)) {

            throw new Error(
                "Import location not found."
            );

        }


        content =
            content.replace(
                importTarget,
                importReplacement
            );
        const validationTarget =
`    const entries =
        normalizeJournalEntries(data);`;


        const validationReplacement =
`    const entries =
        normalizeJournalEntries(data);


    await validateEntries(
        entries
    );`;


        if (!content.includes(validationTarget)) {

            throw new Error(
                "Validation insertion point not found."
            );

        }


        content =
            content.replace(
                validationTarget,
                validationReplacement
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
