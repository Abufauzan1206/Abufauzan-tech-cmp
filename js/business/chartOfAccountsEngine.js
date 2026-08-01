/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-014
 *
 * File: chartOfAccountsEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPIdService } from "./idService.js";

export class CMPChartOfAccountsEngine {

    static accounts = [];

    /**
     * Create a Chart of Account
     */
    static createAccount(account) {

        if (!account.code) {
            throw new Error("Account code is required.");
        }

        if (!account.name) {
            throw new Error("Account name is required.");
        }

        if (!account.category) {
            throw new Error("Account category is required.");
        }

        const exists = this.accounts.find(
            item => item.code === account.code
        );

        if (exists) {
            throw new Error("Account code already exists.");
        }

        const newAccount = {
            accountId: CMPIdService.generate("ACC"),
            createdAt: new Date(),
            active: true,
            ...account
        };

        this.accounts.push(newAccount);

        return newAccount;
    }

    /**
     * Get all accounts
     */
    static getAllAccounts() {
        return [...this.accounts];
    }

    /**
     * Find account by code
     */
    static getByCode(code) {
        return this.accounts.find(
            account => account.code === code
        );
    }

    /**
     * Get accounts by category
     */
    static getByCategory(category) {
        return this.accounts.filter(
            account => account.category === category
        );
    }

}
