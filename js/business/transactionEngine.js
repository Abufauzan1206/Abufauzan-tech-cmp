/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-010
 *
 * File: transactionEngine.js
 * Version: 2.0.0
 * =====================================================
 */

import { CMPIdService } from "./idService.js";
import { CMPRepositoryManager } from "../repositories/repositoryManager.js";
import { CMPJournalBuilderEngine } from "./journalBuilderEngine.js";
import { CMPJournalEngine } from "./journalEngine.js";
import { CMPJournalPostingEngine } from "./journalPostingEngine.js";

export class CMPTransactionEngine {

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

    static create(transaction) {

        if (!transaction.type) {
            throw new Error("Transaction type is required.");
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

        const builtJournal =
            CMPJournalBuilderEngine.build(newTransaction);

        const journal =
            CMPJournalEngine.create(builtJournal);

        CMPJournalPostingEngine.post(journal);

        return newTransaction;

    }

    static getAll() {

        return CMPRepositoryManager
            .transaction
            .getAll();

    }

}
