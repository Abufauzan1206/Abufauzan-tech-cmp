/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: periodClosingEngine.js
 * Version: 1.0.0
 *
 * Period Closing Engine
 * =====================================================
 */

import {
    generateIncomeExpenditure
} from "./incomeExpenditureEngine.js";

import {
    postJournal
} from "./journalPostingEngine.js";

export async function closeAccountingPeriod(
    closedBy = "CMP"
) {

    const report =
        await generateIncomeExpenditure();

    const amount =
        report.netSurplus > 0
            ? report.netSurplus
            : report.netDeficit;

    if (amount <= 0) {

        return {
            success: true,
            closed: false,
            message: "Nothing to close."
        };

    }

    const isSurplus =
        report.netSurplus > 0;

    const journal =
        await postJournal({

            title: "Period Closing",

            debit: amount,
            credit: amount,

            debitAccount:
                isSurplus
                    ? "Contribution Income"
                    : "Members Capital",

            creditAccount:
                isSurplus
                    ? "Members Capital"
                    : "Office Expense",

            createdBy: closedBy

        });

    return {

        success: true,
        closed: true,

        journalNumber:
            journal.journalNumber,

        ledgerBatchNumber:
            journal.ledgerBatchNumber,

        amount,

        message:
            "Accounting period closed successfully."

    };

}
