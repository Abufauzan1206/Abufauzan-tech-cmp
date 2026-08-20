/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Business Engine Layer
 *
 * File: trialBalanceEngine.js
 * Version: 1.0.0
 *
 * Trial Balance Engine
 * =====================================================
 */

import {
    getAllLedgerBatches
} from "../services/trialBalanceService.js";


export async function generateTrialBalance() {

    const batches =
        await getAllLedgerBatches();

    const accounts = {};

    for (const batch of batches) {

        for (const entry of batch.entries || []) {

            const accountName =
                entry.account === "Cash"
                    ? "Cash Account"
                    : entry.account;

            if (!accounts[accountName]) {

                accounts[accountName] = {
                    account: accountName,
                    debit: 0,
                    credit: 0,
                    balance: 0
                };

            }

            accounts[accountName].debit +=
                Number(entry.debit || 0);

            accounts[accountName].credit +=
                Number(entry.credit || 0);

        }

    }


    const report =
        Object.values(accounts);


    for (const account of report) {

        account.balance =
            account.debit - account.credit;

    }


    const totalDebit =
        report.reduce(
            (sum, item) => sum + item.debit,
            0
        );

    const totalCredit =
        report.reduce(
            (sum, item) => sum + item.credit,
            0
        );


    return {

        success: true,

        balanced:
            totalDebit === totalCredit,

        totalDebit,

        totalCredit,

        accounts: report

    };

}
