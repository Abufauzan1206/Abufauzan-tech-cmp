/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #004-E
 *
 * File: rc004EJournalMultiLineFinalizePatch.js
 * Version: 1.0.0
 *
 * Journal Multi-Line Finalization
 * Normalized Matching Edition
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
        "RC004-E - JOURNAL MULTI-LINE FINALIZE"
    );

    console.log(
        "========================================="
    );


    try {

        await patch({

            path: file,

            ignoreWhitespace: true,

            search:
`const debitAccount =
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

    }`,

            replace:
`for (const entry of entries) {

        const account =
            await getAccountByName(
                entry.account
            );


        if (!account) {

            throw new Error(
                \`Account not found: \${entry.account}\`
            );

        }

    }`
        });
        await patch({

            path: file,

            ignoreWhitespace: true,

            search:
`const ledgerResult =
        await postLedgerBatch(
            [
                {
                    account:
                        data.debitAccount ??
                        "Cash Account",

                    debit:
                        data.debit,

                    credit: 0
                },

                {
                    account:
                        data.creditAccount ??
                        "General Income",

                    debit: 0,

                    credit:
                        data.credit
                }

            ],

            data.createdBy ??
            "CMP"
        );`,

            replace:
`const ledgerResult =
        await postLedgerBatch(
            entries,

            data.createdBy ??
            "CMP"
        );`
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
