/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-022
 *
 * File: closingJournalEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import {
    generateIncomeExpenditure
} from "./incomeExpenditureEngine.js";

export class CMPClosingJournalEngine {

    static async generate() {

        const incomeStatement =
            await generateIncomeExpenditure();

        const surplus =
            incomeStatement.netSurplus;

        const entries = [];

        if (surplus > 0) {

            entries.push({

                account: "Current Surplus",

                debit: surplus,

                credit: 0

            });

            entries.push({

                account: "Retained Earnings",

                debit: 0,

                credit: surplus

            });

        } else if (surplus < 0) {

            entries.push({

                account: "Retained Earnings",

                debit: Math.abs(surplus),

                credit: 0

            });

            entries.push({

                account: "Current Deficit",

                debit: 0,

                credit: Math.abs(surplus)

            });

        }

        return {

            surplus,

            entries,

            generatedAt: new Date()

        };

    }

}
