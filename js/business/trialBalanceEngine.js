/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-015
 *
 * File: trialBalanceEngine.js
 * Version: 1.1.0
 * =====================================================
 */

import { CMPLedgerEngine } from "./ledgerEngine.js";

export class CMPTrialBalanceEngine {

    static generate() {

        const ledger = CMPLedgerEngine.getAll();

        const balances = {};

        let totalDebit = 0;
        let totalCredit = 0;

        for (const entry of ledger) {

            if (!balances[entry.account]) {

                balances[entry.account] = {

                    account: entry.account,

                    debit: 0,

                    credit: 0

                };

            }

            balances[entry.account].debit += entry.debit ?? 0;
            balances[entry.account].credit += entry.credit ?? 0;

            totalDebit += entry.debit ?? 0;
            totalCredit += entry.credit ?? 0;

        }

        return {

            accounts: Object.values(balances),

            totalDebit,

            totalCredit,

            balanced: totalDebit === totalCredit

        };

    }

}
