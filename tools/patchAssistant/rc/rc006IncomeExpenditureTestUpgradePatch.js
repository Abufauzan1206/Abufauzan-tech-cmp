/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #006
 *
 * File: rc006IncomeExpenditureTestUpgradePatch.js
 * Version: 1.0.0
 *
 * Income & Expenditure Test Upgrade Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "testIncomeExpenditureEngine.html";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC006 - INCOME & EXPENDITURE TEST UPGRADE"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`    const result =
        await generateIncomeExpenditure();`,

            replace:
`    const result =
        await generateIncomeExpenditure();

    if (result.totalIncome < 0) {

        throw new Error(
            "Invalid total income."
        );

    }

    if (result.totalExpenses < 0) {

        throw new Error(
            "Invalid total expenses."
        );

    }

    if (
        result.netSurplus !==
        result.totalIncome -
        result.totalExpenses
    ) {

        throw new Error(
            "Net surplus calculation is incorrect."
        );

    }`
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
