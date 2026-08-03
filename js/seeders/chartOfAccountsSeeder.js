/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Seeder Module
 *
 * File: chartOfAccountsSeeder.js
 * Version: 1.0.0
 *
 * Standard Chart of Accounts Seeder
 * =====================================================
 */

import {
    createAccount,
    getAllAccounts
} from "../services/chartOfAccountsService.js";

export async function seedChartOfAccounts() {

    const existingAccounts =
        await getAllAccounts();

    if (existingAccounts.length > 0) {

        return {
            success: true,
            seeded: false,
            message: "Chart of Accounts already exists."
        };

    }

    const accounts = [

        {
            code: "1000",
            name: "Cash Account",
            type: "ASSET",
            normalBalance: "DEBIT",
            active: true
        },

        {
            code: "1010",
            name: "Bank Account",
            type: "ASSET",
            normalBalance: "DEBIT",
            active: true
        },

        {
            code: "3000",
            name: "Members Capital",
            type: "EQUITY",
            normalBalance: "CREDIT",
            active: true
        },

        {
            code: "4000",
            name: "Contribution Income",
            type: "INCOME",
            normalBalance: "CREDIT",
            active: true
        },

        {
            code: "5000",
            name: "Office Expense",
            type: "EXPENSE",
            normalBalance: "DEBIT",
            active: true
        }

    ];

    for (const account of accounts) {
        await createAccount(account);
    }

    return {
        success: true,
        seeded: true,
        totalAccounts: accounts.length,
        message: "Chart of Accounts seeded successfully."
    };

}
