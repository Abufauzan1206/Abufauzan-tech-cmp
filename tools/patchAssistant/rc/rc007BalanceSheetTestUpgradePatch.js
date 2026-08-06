/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #007
 *
 * File: rc007BalanceSheetTestUpgradePatch.js
 * Version: 1.0.0
 *
 * Balance Sheet Test Upgrade Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "testBalanceSheetEngine.html";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC007 - BALANCE SHEET TEST UPGRADE"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`    const result =
        await generateBalanceSheet();`,

            replace:
`    const result =
        await generateBalanceSheet();

    if (result.totalAssets < 0) {

        throw new Error(
            "Invalid total assets."
        );

    }

    if (result.totalLiabilities < 0) {

        throw new Error(
            "Invalid total liabilities."
        );

    }

    if (result.totalEquity < 0) {

        throw new Error(
            "Invalid total equity."
        );

    }

    if (!result.balanced) {

        throw new Error(
            "Balance sheet is not balanced."
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
