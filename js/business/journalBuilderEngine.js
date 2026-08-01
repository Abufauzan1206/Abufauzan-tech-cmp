/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-013B
 *
 * File: journalBuilderEngine.js
 * Version: 1.0.0
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

                    description:
                        "Member Contribution",

                    entries: [

                        {
                            account: "Cash",
                            debit: transaction.amount,
                            credit: 0,
                            transactionId: transaction.transactionId
                        },

                        {
                            account: "Member Contributions",
                            debit: 0,
                            credit: transaction.amount,
                            transactionId: transaction.transactionId
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
