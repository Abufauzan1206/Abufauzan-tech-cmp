/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-014
 *
 * File: chartOfAccounts.js
 * Version: 1.0.0
 * =====================================================
 */
 
 import { CMPAccountTypes } from "./accountTypes.js";

export class CMPChartOfAccounts {

    static ACCOUNTS = {

    // ==========================
    // Assets
    // ==========================
    CASH: {
        code: "1001",
        name: "Cash Account",
        type: CMPAccountTypes.TYPES.ASSET
    },

    BANK: {
        code: "1002",
        name: "Bank Account",
        type: CMPAccountTypes.TYPES.ASSET
    },

    LOANS_RECEIVABLE: {
        code: "1003",
        name: "Loans Receivable",
        type: CMPAccountTypes.TYPES.ASSET
    },

    // ==========================
    // Liabilities
    // ==========================
    MEMBER_CONTRIBUTIONS: {
        code: "2001",
        name: "Member Contributions",
        type: CMPAccountTypes.TYPES.LIABILITY
    },

    MEMBER_SAVINGS: {
        code: "2002",
        name: "Member Savings",
        type: CMPAccountTypes.TYPES.LIABILITY
    },

    // ==========================
    // Income
    // ==========================
    REGISTRATION_FEES: {
        code: "4001",
        name: "Registration Fees",
        type: CMPAccountTypes.TYPES.INCOME
    },

    INTEREST_INCOME: {
        code: "4002",
        name: "Interest Income",
        type: CMPAccountTypes.TYPES.INCOME
    },

    // ==========================
    // Expenses
    // ==========================
    OFFICE_EXPENSES: {
        code: "5001",
        name: "Office Expenses",
        type: CMPAccountTypes.TYPES.EXPENSE
    },

    UTILITIES: {
        code: "5002",
        name: "Utilities",
        type: CMPAccountTypes.TYPES.EXPENSE
    },

    BONANZA_EXPENSE: {
        code: "5003",
        name: "Bonanza Expense",
        type: CMPAccountTypes.TYPES.EXPENSE
    }

};

}