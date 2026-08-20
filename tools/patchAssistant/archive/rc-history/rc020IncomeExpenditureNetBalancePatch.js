/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #020
 *
 * File: rc020IncomeExpenditureNetBalancePatch.js
 * Version: 1.0.0
 *
 * Income & Expenditure Net Balance Correction
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/incomeExpenditureEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC020 - INCOME & EXPENDITURE NET BALANCE"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`            case "INCOME":

                incomeAccounts.push(account);
                totalIncome += Number(account.credit || 0);
                break;

            case "EXPENSE":

                expenseAccounts.push(account);
                totalExpenses += Number(account.debit || 0);
                break;`,

            replace:
`            case "INCOME":

                incomeAccounts.push(account);

                totalIncome +=
                    Number(account.credit || 0) -
                    Number(account.debit || 0);

                break;

            case "EXPENSE":

                expenseAccounts.push(account);

                totalExpenses +=
                    Number(account.debit || 0) -
                    Number(account.credit || 0);

                break;`

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
