/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-017
 *
 * File: balanceSheetEngine.js
 * Version: 2.0.0
 * =====================================================
 */

import { CMPTrialBalanceEngine } from "./trialBalanceEngine.js";
import { CMPIncomeExpenditureEngine } from "./incomeExpenditureEngine.js";

export class CMPBalanceSheetEngine {

    static generate() {

        const trialBalance =
            CMPTrialBalanceEngine.generate();

        const incomeStatement =
            CMPIncomeExpenditureEngine.generate();

        const assets = [];
        const liabilities = [];

        let totalAssets = 0;
        let totalLiabilities = 0;

        for (const account of trialBalance.accounts) {

            const name =
                account.account.toUpperCase();

            if (

                name.includes("CASH") ||
                name.includes("BANK") ||
                name.includes("ASSET") ||
                name.includes("LOAN")

            ) {

                assets.push(account);

                totalAssets += account.debit;

            }

            else if (

                name.includes("PAYABLE") ||
                name.includes("LIABILITY") ||
                name.includes("SAVINGS")

            ) {

                liabilities.push(account);

                totalLiabilities += account.credit;

            }

        }

        const equity = [

            {

                account: "Current Surplus",

                debit: 0,

                credit: incomeStatement.surplus

            }

        ];

        const totalEquity =
            incomeStatement.surplus;

        return {

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

}
