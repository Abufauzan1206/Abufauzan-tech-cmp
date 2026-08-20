/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-027
 *
 * File: financialClosingCoordinator.js
 * Version: 1.0.0
 * =====================================================
 */

import { generateTrialBalance } from "./trialBalanceEngine.js";

import { CMPClosingJournalEngine }
from "./closingJournalEngine.js";

import {
    postClosingJournal
}
from "./closingJournalPostingEngine.js";

import { CMPOpeningBalanceEngine } 
from "./openingBalanceEngine.js";

import { CMPPeriodLockEngine } 
from "./periodLockEngine.js";

import { closeYear } from "./financialYearEngine.js";
import { getFinancialYearById } from "../services/financialYearService.js";

import {
    CMPAuditTrailEngine
} from "./auditTrailEngine.js";

import {
    createPeriod
} from "./accountingPeriodEngine.js";

import {
    createYear
} from "./financialYearEngine.js";

import {
    postJournal
} from "./journalPostingEngine.js";


export class CMPFinancialClosingCoordinator {


    static async close(financialYearId, year) {


        const trialBalance =
            await generateTrialBalance();


        if (!trialBalance.balanced) {

            throw new Error(
                "Cannot close. Trial Balance is not balanced."
            );

        }


        const closingJournal =
            await CMPClosingJournalEngine.generate();

        const closingPosting =
            await postClosingJournal(
                new Date().toISOString().split("T")[0]
            );



        const openingBalance =
            await CMPOpeningBalanceEngine.generate();

        const nextYear =
            Number(year) + 1;

        const nextYearStart =
            `${nextYear}-01-01`;

        const nextYearEnd =
            `${nextYear}-12-31`;

        const openingEntries =
            openingBalance.openingBalances
                .map(item => {
                    const balance =
                        Number(item.debit || 0) -
                        Number(item.credit || 0);

                    if (balance > 0) {
                        return {
                            account: item.account,
                            debit: balance,
                            credit: 0
                        };
                    }

                    if (balance < 0) {
                        return {
                            account: item.account,
                            debit: 0,
                            credit: Math.abs(balance)
                        };
                    }

                    return null;
                })
                .filter(Boolean);

        let nextFinancialYear = null;
        let nextAccountingPeriod = null;
        let openingPosting = null;

        if (openingEntries.length > 0) {

            nextFinancialYear =
                await createYear({
                    name:
                        `Financial Year ${nextYear}`,
                    startDate:
                        nextYearStart,
                    endDate: nextYearEnd
                });

            nextAccountingPeriod =
                await createPeriod({
                    name: `Accounting Period ${nextYear}`,
                    financialYearId:
                        nextFinancialYear.id,
                    startDate:
                        nextYearStart,
                    endDate:
                        nextYearEnd
                });

            openingPosting =
                await postJournal({
                    date:
                        nextYearStart,
                    title:
                        "Opening Balance Journal",
                    reference:
                        `OPENING-BALANCE-${nextYear}`,
                    entries:
                        openingEntries,
                    createdBy:
                        "SYSTEM"
                });
        }



        const periodLock =
            CMPPeriodLockEngine.lock(
                String(year)
            );



        await closeYear(financialYearId);

        const financialYear =
            await getFinancialYearById(financialYearId);



        const audit =
            CMPAuditTrailEngine.record({

                user: "SYSTEM",

                action: "YEAR_CLOSE",

                module: "Financial Closing",

                reference: String(year),

                description:
                    "Financial year closed successfully"

            });



        return {


            year,

            status: "CLOSED",


            trialBalance,


            closingJournal,

            closingPosting,

            openingBalance,
            openingEntries,
            nextFinancialYear,
            nextAccountingPeriod,
            openingPosting,periodLock,


            financialYear,


            audit,


            closedAt: new Date()


        };


    }


}
