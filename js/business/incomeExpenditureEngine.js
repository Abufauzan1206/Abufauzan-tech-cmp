/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-016
 *
 * File: incomeExpenditureEngine.js
 * Version: 1.1.0
 * =====================================================
 */

import { CMPTrialBalanceEngine } from "./trialBalanceEngine.js";

export class CMPIncomeExpenditureEngine {

    static generate() {

        const trialBalance =
            CMPTrialBalanceEngine.generate();

        const income = [];
        const expenses = [];

        let totalIncome = 0;
        let totalExpenses = 0;

        for (const account of trialBalance.accounts) {

            const name =
                account.account.toUpperCase();

            if (

                name.includes("CONTRIBUTION") ||
                name.includes("INCOME") ||
                name.includes("INTEREST") ||
                name.includes("DONATION") ||
                name.includes("INVESTMENT")

            ) {

                income.push(account);

                totalIncome += account.credit;

            }

            if (

                name.includes("EXPENSE") ||
                name.includes("SALARY") ||
                name.includes("UTILITY") ||
                name.includes("WELFARE") ||
                name.includes("ADMIN")

            ) {

                expenses.push(account);

                totalExpenses += account.debit;

            }

        }

        return {

            income,

            expenses,

            totalIncome,

            totalExpenses,

            surplus:
                totalIncome - totalExpenses

        };

    }

}
