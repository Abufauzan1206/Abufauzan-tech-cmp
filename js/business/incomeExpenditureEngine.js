/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: incomeExpenditureEngine.js
 * Version: 2.0.0
 *
 * Smart Income & Expenditure Engine
 * =====================================================
 */

import {
    generateTrialBalance
} from "./trialBalanceEngine.js";

import {
    getAccountByName
} from "../services/chartOfAccountsService.js";

export async function generateIncomeExpenditure() {

    const trialBalance =
        await generateTrialBalance();

    const incomeAccounts = [];
    const expenseAccounts = [];

    let totalIncome = 0;
    let totalExpenses = 0;

    for (const account of trialBalance.accounts) {

        const chartAccount =
            await getAccountByName(account.account);

        if (!chartAccount) {
            continue;
        }

        switch (chartAccount.type) {

            case "INCOME":

                incomeAccounts.push(account);
                totalIncome += Number(account.credit || 0);
                break;

            case "EXPENSE":

                expenseAccounts.push(account);
                totalExpenses += Number(account.debit || 0);
                break;

            default:
                // Ignore ASSET, LIABILITY and EQUITY
                break;

        }

    }

    return {

        success: true,
        incomeAccounts,
        expenseAccounts,
        totalIncome,
        totalExpenses,
        netSurplus: totalIncome - totalExpenses,
        netDeficit:
            totalExpenses > totalIncome
                ? totalExpenses - totalIncome
                : 0

    };

}
