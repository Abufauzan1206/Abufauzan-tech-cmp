/**
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
                `Account not found: ${entry.account}`
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


export async function validateAccountingPeriod(date) {

    const period =
        await getAccountingPeriodByDate(
            date
        );


    if (!period) {

        throw new Error(
            "Accounting period not found."
        );

    }


    if (
        period.status &&
        period.status !== "OPEN"
    ) {

        throw new Error(
            "Accounting period is closed."
        );

    }


    return period;

}






