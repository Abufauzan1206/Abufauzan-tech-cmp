/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #004-B
 *
 * File: rc004BJournalMultiLineContinuationPatch.js
 * Version: 1.0.0
 *
 * Journal Multi-Line Continuation Patch
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
        "RC004-B - JOURNAL MULTI-LINE CONTINUATION"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`    if (!data.title) {
        throw new Error(
            "Journal title is required."
        );
    }`,

            replace:
`    if (!data.title) {
        throw new Error(
            "Journal title is required."
        );
    }


    const entries =
        normalizeJournalEntries(data);`
        });


        await patch({

            path: file,

            search:
`    if (
        data.debit == null ||
        data.credit == null
    ) {
        throw new Error(
            "Debit and Credit are required."
        );
    }

    if (
        Number(data.debit) !==
        Number(data.credit)
    ) {
        throw new Error(
            "Journal is not balanced."
        );
    }`,

            replace:
`    if (
        !entries ||
        entries.length === 0
    ) {

        throw new Error(
            "Journal entries are required."
        );

    }


    const totalDebit =
        entries.reduce(
            (sum, entry) =>
                sum + Number(entry.debit || 0),
            0
        );


    const totalCredit =
        entries.reduce(
            (sum, entry) =>
                sum + Number(entry.credit || 0),
            0
        );


    if (totalDebit !== totalCredit) {

        throw new Error(
            "Journal is not balanced."
        );

    }`
        });
        await patch({

            path: file,

            search:
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
    }`,

            replace:
`    for (const entry of entries) {

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

            search:
`    const ledgerResult =
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
`    const ledgerResult =
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
