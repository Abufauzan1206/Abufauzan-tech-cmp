/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #008
 *
 * File: rc008BalanceSheetSurplusIntegrationPatch.js
 * Version: 1.0.0
 *
 * Balance Sheet Surplus Integration Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/balanceSheetEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC008 - BALANCE SHEET SURPLUS INTEGRATION"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`import {
    getAccountByName
} from "../services/chartOfAccountsService.js";`,

            replace:
`import {
    getAccountByName
} from "../services/chartOfAccountsService.js";

import {
    generateIncomeExpenditure
} from "./incomeExpenditureEngine.js";`
        });

        await patch({

            path: file,

            search:
`    return {`,

            replace:
`    const incomeReport =
        await generateIncomeExpenditure();

    totalEquity +=
        incomeReport.netSurplus;

    totalEquity -=
        incomeReport.netDeficit;

    return {`
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
