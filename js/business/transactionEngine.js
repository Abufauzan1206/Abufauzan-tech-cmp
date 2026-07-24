/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-010
 *
 * File: transactionEngine.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPIdService } from "./idService.js";

import { CMPRepositoryManager } from "../repositories/repositoryManager.js";

export class CMPTransactionEngine {
    
    /**
 * Supported transaction types
 */
static TYPES = {

    CONTRIBUTION: "CONTRIBUTION",

    LOAN_DISBURSEMENT: "LOAN_DISBURSEMENT",

    LOAN_REPAYMENT: "LOAN_REPAYMENT",

    INVESTMENT: "INVESTMENT",

    DONATION: "DONATION",

    BONANZA: "BONANZA",

    SAVINGS: "SAVINGS",

    WITHDRAWAL: "WITHDRAWAL",

    EXPENSE: "EXPENSE"

};

    /**
     * Record a financial transaction
     */
     
    static create(transaction) {
      
      if (!transaction.type) {

    throw new Error(
        "Transaction type is required."
    );

}

        const newTransaction = {

            transactionId:
                CMPIdService.generate("TRN"),

            createdAt:
                new Date(),
                
                transactionDate:
    new Date(),

            status:
    "pending",

currency:
    "NGN",

...transaction

        };

        CMPRepositoryManager
    .transaction
    .save(newTransaction);

return newTransaction;

    }

    /**
     * Get all transactions
     */
    static getAll() {

    return CMPRepositoryManager
        .transaction
        .getAll();

}

}