/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-019
 *
 * File: accountClassificationEngine.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPAccountClassificationEngine {

    static classifications = {

        CASH: {

            category: "ASSET",

            statement: "BALANCE_SHEET",

            cashFlow: "OPERATING",

            normalBalance: "DEBIT"

        },

        BANK: {

            category: "ASSET",

            statement: "BALANCE_SHEET",

            cashFlow: "OPERATING",

            normalBalance: "DEBIT"

        },

        CONTRIBUTION: {
            category: "INCOME",
            statement: "INCOME_EXPENDITURE",
            cashFlow: "OPERATING",
            normalBalance: "CREDIT"
        },

        MEMBERS: {
            category: "EQUITY",
            statement: "BALANCE_SHEET",
            cashFlow: "FINANCING",
            normalBalance: "CREDIT"
        },

        EXPENSE: {

            category: "EXPENSE",

            statement: "INCOME_EXPENDITURE",

            cashFlow: "OPERATING",

            normalBalance: "DEBIT"

        },

        INVESTMENT: {

            category: "ASSET",

            statement: "BALANCE_SHEET",

            cashFlow: "INVESTING",

            normalBalance: "DEBIT"

        },

        LOAN: {

            category: "LIABILITY",

            statement: "BALANCE_SHEET",

            cashFlow: "FINANCING",

            normalBalance: "CREDIT"

        }

    };

    static get(type) {

        return this.classifications[type] ?? null;

    }

}
