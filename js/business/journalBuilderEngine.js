/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-013B
 *
 * File: journalBuilderEngine.js
 * Version: 2.0.0
 *
 * Transaction → Journal Builder
 * =====================================================
 */

export class CMPJournalBuilderEngine {

    /**
     * Build journal entries from a transaction
     */
    static build(transaction) {

        switch (transaction.type) {

            case "CONTRIBUTION":

                return {

                    title:
                        "Member Contribution",

                    description:
                        transaction.description ??
                        "Member Contribution",

                    date:
                        transaction.transactionDate,

                    reference:
            transaction.reference ?? transaction.transactionId,

                    entries: [

                        {
                            account:
                                transaction.account ?? "Cash Account",

                            debit:
                                transaction.amount,

                            credit:
                                0,

                            transactionId:
                                transaction.transactionId
                        },

                        {
                            account:
                                "Contribution Income",

                            debit:
                                0,

                            credit:
                                transaction.amount,

                            transactionId:
                                transaction.transactionId
                        }

                    ]

                };

            case "EXPENSE":
                return {
                    title:
                        "Expense Payment",
                    description:
                        transaction.description ??
                        "Expense Payment",
                    date:
                        transaction.transactionDate,
                    reference:
                transaction.reference ?? transaction.transactionId,
                    entries: [
                        {
                            account:
                                "Office Expense",
                            debit:
                                transaction.amount,
                            credit:
                                0,
                            transactionId:
                                transaction.transactionId
                        },
                        {
                            account:
                                "Bank Account",
                            debit:
                                0,
                            credit:
                                transaction.amount,
                            transactionId:
                                transaction.transactionId
                        }
                    ]
                };

            default:

                throw new Error(
                    `No journal builder found for transaction type: ${transaction.type}`
                );

        }

    }

}
