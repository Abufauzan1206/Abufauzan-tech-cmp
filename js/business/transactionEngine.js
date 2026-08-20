/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Module: BM-010
 *
 * File: transactionEngine.js
 * Version: 2.1.0
 *
 * Transaction Engine
 * =====================================================
 */

import { CMPIdService }
    from "./idService.js";

import { CMPRepositoryManager }
    from "../repositories/repositoryManager.js";

import { CMPJournalBuilderEngine }
    from "./journalBuilderEngine.js";



import { CMPJournalPostingEngine }
    from "./journalPostingEngine.js";


export class CMPTransactionEngine {

    static TYPES = {

        CONTRIBUTION:
            "CONTRIBUTION",

        LOAN_DISBURSEMENT:
            "LOAN_DISBURSEMENT",

        LOAN_REPAYMENT:
            "LOAN_REPAYMENT",

        INVESTMENT:
            "INVESTMENT",

        DONATION:
            "DONATION",

        BONANZA:
            "BONANZA",

        SAVINGS:
            "SAVINGS",

        WITHDRAWAL:
            "WITHDRAWAL",

        EXPENSE:
            "EXPENSE"

    };


    static async create(transaction) {

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


        const builtJournal =
            CMPJournalBuilderEngine
                .build(newTransaction);

        const postingResult =
            await CMPJournalPostingEngine
                .post(builtJournal);

        newTransaction.status = "POSTED";
        newTransaction.postedAt = new Date();

        const transactionRecord =
            await CMPRepositoryManager
                .transaction
                .create(newTransaction);

        return {
            ...transactionRecord,
            journalDocumentId:
                postingResult.journalDocumentId,
            ledgerDocumentId:
                postingResult.ledgerDocumentId,
            journalNumber:
                postingResult.journalNumber,
            ledgerBatchNumber:
                postingResult.ledgerBatchNumber,
            accountingPeriod:
                postingResult.accountingPeriod,
            financialYearId:
                postingResult.financialYearId,
            accountingPeriodId:
                postingResult.accountingPeriodId
        };

    }


    static getAll() {

        return CMPRepositoryManager
            .transaction
            .findAll();

    }

}
