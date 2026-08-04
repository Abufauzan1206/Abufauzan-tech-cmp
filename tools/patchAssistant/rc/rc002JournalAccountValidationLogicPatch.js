/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #002
 *
 * File: rc002JournalAccountValidationLogicPatch.js
 * Version: 1.0.0
 *
 * Journal Account Validation Logic Patch
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
        "RC002 - JOURNAL ACCOUNT VALIDATION LOGIC"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                search:
`    const journal = {`,

                replace:
`    const debitAccount =
        await getAccountByName(
            data.debitAccount
        );

    if (!debitAccount) {

        throw new Error(
            \`Debit account not found: \${data.debitAccount}\`
        );

    }

    const creditAccount =
        await getAccountByName(
            data.creditAccount
        );

    if (!creditAccount) {

        throw new Error(
            \`Credit account not found: \${data.creditAccount}\`
        );

    }

    const journal = {`

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
