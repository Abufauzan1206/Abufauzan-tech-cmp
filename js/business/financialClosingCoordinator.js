/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-027
 *
 * File: financialClosingCoordinator.js
 * Version: 1.0.0
 * =====================================================
 */

import { CMPTrialBalanceEngine } 
from "./trialBalanceEngine.js";

import { CMPClosingJournalEngine } 
from "./closingJournalEngine.js";

import { CMPOpeningBalanceEngine } 
from "./openingBalanceEngine.js";

import { CMPPeriodLockEngine } 
from "./periodLockEngine.js";

import { CMPFinancialYearEngine } 
from "./financialYearEngine.js";

import { CMPAuditTrailEngine } 
from "./auditTrailEngine.js";


export class CMPFinancialClosingCoordinator {


    static close(year) {


        const trialBalance =
            CMPTrialBalanceEngine.generate();


        if (!trialBalance.balanced) {

            throw new Error(
                "Cannot close. Trial Balance is not balanced."
            );

        }


        const closingJournal =
            CMPClosingJournalEngine.generate();



        const openingBalance =
            CMPOpeningBalanceEngine.generate();



        const periodLock =
            CMPPeriodLockEngine.lock(
                String(year)
            );



        const financialYear =
            CMPFinancialYearEngine.close(
                year
            );



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


            openingBalance,


            periodLock,


            financialYear,


            audit,


            closedAt: new Date()


        };


    }


}
