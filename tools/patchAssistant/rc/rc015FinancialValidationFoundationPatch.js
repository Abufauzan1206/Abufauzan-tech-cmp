/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #015
 *
 * File: rc015FinancialValidationFoundationPatch.js
 * Version: 1.0.0
 *
 * Financial Validation Engine Foundation
 * =====================================================
 */

import fs from "fs";

const TARGET_FILE =
    "js/services/financialValidationService.js";


const CONTENT = `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Service Layer
 *
 * File: financialValidationService.js
 * Version: 1.0.0
 *
 * Financial Validation Service
 * =====================================================
 */

import {
    getAccountByName
} from "./chartOfAccountsService.js";

import {
    getAccountingPeriodByDate
} from "./accountingPeriodService.js";


export async function validateEntries(entries) {

    if (
        !Array.isArray(entries) ||
        entries.length === 0
    ) {

        throw new Error(
            "Financial entries are required."
        );

    }


    let totalDebit = 0;
    let totalCredit = 0;


    for (const entry of entries) {

        totalDebit +=
            Number(entry.debit || 0);

        totalCredit +=
            Number(entry.credit || 0);


        const account =
            await getAccountByName(
                entry.account
            );


        if (!account) {

            throw new Error(
                \`Account not found: \${entry.account}\`
            );

        }

    }


    if (totalDebit !== totalCredit) {

        throw new Error(
            "Financial entries are not balanced."
        );

    }


    return true;

}
`;

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC015 - FINANCIAL VALIDATION FOUNDATION"
    );

    console.log(
        "========================================="
    );
    try {

        fs.writeFileSync(
            TARGET_FILE,
            CONTENT,
            "utf8"
        );


        console.log(
            "PATCH: PASS"
        );


        console.log(
            "Created:",
            TARGET_FILE
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
