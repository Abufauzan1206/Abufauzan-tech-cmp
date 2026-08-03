/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: balanceSheetEngine.js
 * Version: 1.0.0
 *
 * Balance Sheet Engine
 * =====================================================
 */

import {
    generateTrialBalance
} from "./trialBalanceEngine.js";

import {
    getAccountByName
} from "../services/chartOfAccountsService.js";

export async function generateBalanceSheet() {

    const trialBalance =
        await generateTrialBalance();

    const assets = [];
    const liabilities = [];
    const equity = [];

    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    for (const account of trialBalance.accounts) {

        const chartAccount =
            await getAccountByName(account.account);

        if (!chartAccount) {
            continue;
        }

        switch (chartAccount.type) {

            case "ASSET":

                assets.push(account);
                totalAssets += Number(account.balance || 0);
                break;

            case "LIABILITY":

                liabilities.push(account);
                totalLiabilities += Math.abs(
                    Number(account.balance || 0)
                );
                break;

            case "EQUITY":

                equity.push(account);
                totalEquity += Math.abs(
                    Number(account.balance || 0)
                );
                break;

            default:
                // Ignore INCOME and EXPENSE accounts
                break;

        }

    }

    return {

        success: true,

        assets,
        liabilities,
        equity,

        totalAssets,
        totalLiabilities,
        totalEquity,

        balanced:
            totalAssets ===
            (totalLiabilities + totalEquity)

    };

}
