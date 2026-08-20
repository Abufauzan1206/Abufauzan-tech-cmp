/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #024
 *
 * File: rc024TrialBalanceCashAliasPatch.js
 * Version: 1.0.0
 *
 * Normalize legacy Cash account to Cash Account
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/trialBalanceEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC024 - TRIAL BALANCE CASH ALIAS"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`        for (const entry of batch.entries || []) {`,

            replace:
`        for (const entry of batch.entries || []) {

            const accountName =
                entry.account === "Cash"
                    ? "Cash Account"
                    : entry.account;`

        });

        await patch({

            path: file,

            search:
`            if (!accounts[entry.account]) {`,

            replace:
`            if (!accounts[accountName]) {`

        });

        await patch({

            path: file,

            search:
`                    account: entry.account,`,

            replace:
`                    account: accountName,`

        });

        await patch({

            path: file,

            search:
`            accounts[entry.account].debit +=
                Number(entry.debit || 0);

            accounts[entry.account].credit +=
                Number(entry.credit || 0);`,

            replace:
`            accounts[accountName].debit +=
                Number(entry.debit || 0);

            accounts[accountName].credit +=
                Number(entry.credit || 0);`

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
