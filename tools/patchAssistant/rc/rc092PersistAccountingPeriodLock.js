/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC092 - PERSIST ACCOUNTING PERIOD LOCK
 *
 * Fix Financial Closing Coordinator so the accounting
 * period lock is persisted through the Accounting
 * Period Engine instead of only using the in-memory
 * Period Lock Engine.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/financialClosingCoordinator.js",
        mode: "exact",

        search:
`import {
    createPeriod
} from "./accountingPeriodEngine.js";`,

        replace:
`import {
    createPeriod,
    lockPeriod
} from "./accountingPeriodEngine.js";

import {
    getAllAccountingPeriods
} from "../services/accountingPeriodService.js";`
    },

    {
        path: "js/business/financialClosingCoordinator.js",
        mode: "exact",

        search:
`const periodLock =
            CMPPeriodLockEngine.lock(
                String(year)
            );`,

        replace:
`const accountingPeriods =
            await getAllAccountingPeriods();

        const currentAccountingPeriod =
            accountingPeriods.find(
                period =>
                    period.financialYearId === financialYearId &&
                    period.status === "OPEN" &&
                    period.locked !== true
            );

        if (!currentAccountingPeriod) {
            throw new Error(
                "No open accounting period found for financial year."
            );
        }

        const periodLock =
            await lockPeriod(
                currentAccountingPeriod.id,
                "SYSTEM",
                "Financial year closing"
            );`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC092 - PERSIST ACCOUNTING PERIOD LOCK");
    console.log("=========================================");

    const result =
        await transaction(patches);

    console.log("RC092 TRANSACTION RESULT:");

    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC092 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC092 PATCH COMPLETE");
    console.log("=========================================");
}

run();
