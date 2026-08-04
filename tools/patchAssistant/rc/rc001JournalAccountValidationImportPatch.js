/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #001
 *
 * File: rc001JournalAccountValidationImportPatch.js
 * Version: 1.0.0
 *
 * Journal Account Validation Import Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/journalPostingEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC001 - JOURNAL ACCOUNT VALIDATION IMPORT"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                search:
`import {
    getAccountingPeriodByDate
} from "../services/accountingPeriodService.js";`,

                replace:
`import {
    getAccountingPeriodByDate
} from "../services/accountingPeriodService.js";

import {
    getAccountByName
} from "../services/chartOfAccountsService.js";`

            });

        console.log(
            "PATCH: PASS"
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
