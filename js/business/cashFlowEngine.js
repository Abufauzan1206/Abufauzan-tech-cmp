/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-018
 *
 * File: cashFlowEngine.js
 * Version: 2.0.0
 * =====================================================
 */

import {
    generateTrialBalance
} from "./trialBalanceEngine.js";
import { CMPAccountClassificationEngine } from "./accountClassificationEngine.js";

export class CMPCashFlowEngine {

    static async generate() {

        const trialBalance =
            await generateTrialBalance();

        const operating = [];
        const investing = [];
        const financing = [];

        let operatingCash = 0;
        let investingCash = 0;
        let financingCash = 0;

        for (const account of trialBalance.accounts) {

            const key =
                account.account
                    .toUpperCase()
                    .split(" ")[0];

            const info =
                CMPAccountClassificationEngine.get(key);

            if (!info) continue;

            switch (info.cashFlow) {

                case "OPERATING":

                    operating.push(account);

                    if (key === "CASH" || key === "BANK") {

                        operatingCash += account.debit;
                        operatingCash -= account.credit;

                    }

                    break;

                case "INVESTING":

                    investing.push(account);

                    investingCash += account.debit;
                    investingCash -= account.credit;

                    break;

                case "FINANCING":

                    financing.push(account);

                    financingCash += account.debit;
                    financingCash -= account.credit;

                    break;

            }

        }

        return {

            operating,

            investing,

            financing,

            operatingCash,

            investingCash,

            financingCash,

            netCashFlow:

                operatingCash +

                investingCash +

                financingCash

        };

    }

}
