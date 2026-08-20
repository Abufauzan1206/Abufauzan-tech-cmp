/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-023
 *
 * File: openingBalanceEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import { generateTrialBalance } from "./trialBalanceEngine.js";
import { CMPAccountClassificationEngine } from "./accountClassificationEngine.js";

export class CMPOpeningBalanceEngine {

    static async generate() {

        const trialBalance =
            await generateTrialBalance();

        const openingBalances = [];

        for (const account of trialBalance.accounts) {

            const key =
                account.account
                    .toUpperCase()
                    .split(" ")[0];

            const info =
                CMPAccountClassificationEngine.get(key);

            if (!info) continue;

            if (
                info.category === "ASSET" ||
                info.category === "LIABILITY" ||
                info.category === "EQUITY"
            ) {

                openingBalances.push({

                    account: account.account,

                    debit: account.debit,

                    credit: account.credit,

                    category: info.category

                });

            }

        }

        return {

            financialYear:

                new Date().getFullYear() + 1,

            openingBalances,

            generatedAt:

                new Date()

        };

    }

}
