import { seedChartOfAccounts } from "./js/seeders/chartOfAccountsSeeder.js";
import { createPeriod } from "./js/business/accountingPeriodEngine.js";
import {
    getAccountingPeriodById,
    getAllAccountingPeriods,
    getAccountingPeriodByDate
} from "./js/services/accountingPeriodService.js";
import { createYear } from "./js/business/financialYearEngine.js";
import { getAllFinancialYears } from "./js/services/financialYearService.js";
import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { getAuthenticatedProfile } from "./js/controllers/accessController.js";
import { generateCashBook } from "./js/business/cashBookEngine.js";

async function runTest() {
    const fixtureToken = Date.now();

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC068 - CASH BOOK TRANSACTION INTEGRATION");
    console.log("=========================================");

    try {
        const seedResult = await seedChartOfAccounts();

        if (!seedResult || seedResult.success !== true) {
            throw new Error("Chart of Accounts seeding failed.");
        }

        console.log("===== D125 LIVE FINANCIAL YEARS =====");
        const d125FinancialYears = await getAllFinancialYears();
        console.log("D125 FINANCIAL YEAR COUNT:", d125FinancialYears.length);
        console.log(
            "D125 FINANCIAL YEARS:",
            JSON.stringify(
                d125FinancialYears.map(year => ({
                    id: year.id,
                    name: year.name,
                    startDate: year.startDate,
                    endDate: year.endDate,
                    status: year.status,
                    locked: year.locked
                })),
                null,
                2
            )
        );

        const usedCalendarYears = new Set(
            d125FinancialYears
                .map(year => {
                    const match = String(year.startDate ?? "").match(/^(\d{4})/);
                    return match ? Number(match[1]) : null;
                })
                .filter(year => Number.isInteger(year))
        );

        let fixtureYear = 2031;

        while (usedCalendarYears.has(fixtureYear)) {
            fixtureYear += 1;
        }

        const fixtureYearName =
            `FY ${fixtureYear} Cash Book Integration Test ${fixtureToken}`;

        const fixturePeriodName =
            `${fixtureYear} RC068 ${fixtureToken}`;

        const fixtureStartDate =
            `${fixtureYear}-01-01T00:00:00.000Z`;

        const fixtureEndDate =
            `${fixtureYear}-12-31T23:59:59.999Z`;

        const fixtureJournalDate =
            `${fixtureYear}-01-15T12:00:00.000Z`;

        console.log("D125 SELECTED CLEAN FIXTURE YEAR:", fixtureYear);
        console.log("D125 FIXTURE YEAR NAME:", fixtureYearName);

        const financialYear = await createYear({
            name: fixtureYearName,
            startDate: fixtureStartDate,
            endDate: fixtureEndDate
        });

        if (!financialYear || financialYear.success !== true) {
            throw new Error("Financial year creation failed.");
        }

        const period = await createPeriod({
            name: fixturePeriodName,
            financialYearId: financialYear.id,
            startDate: fixtureStartDate,
            endDate: fixtureEndDate
        });

        if (!period || period.success !== true) {
            throw new Error("Accounting period creation failed.");
        }

        console.log("D125 CREATED PERIOD ID:", period.id);
        console.log(
            "D125 CREATED PERIOD OBJECT:",
            JSON.stringify(period.period, null, 2)
        );

        const readback = await getAccountingPeriodById(period.id);

        console.log(
            "D125 PERIOD READBACK:",
            JSON.stringify(readback, null, 2)
        );

        if (!readback) {
            throw new Error("D125 period readback failed.");
        }

        const allPeriodsAfterCreate =
            await getAllAccountingPeriods();

        const matching2030 =
            allPeriodsAfterCreate.filter(
                item =>
                    item?.id === period.id ||
                    item?.name === fixturePeriodName
            );

        console.log(
            `D125 MATCHING ${fixtureYear} PERIODS AFTER CREATE:`,
            JSON.stringify(matching2030, null, 2)
        );

        const d125JournalDate =
            fixtureJournalDate;

        console.log(
            "D125 DIRECT RESOLVER INPUT:",
            d125JournalDate
        );

        const d125ResolvedPeriod =
            await getAccountingPeriodByDate(d125JournalDate);

        console.log(
            "D125 DIRECT RESOLVER RESULT:",
            JSON.stringify(d125ResolvedPeriod, null, 2)
        );

        const d125AllPeriods =
            await getAllAccountingPeriods();

        const d125TargetDate =
            new Date(d125JournalDate);

        const d125Matches =
            d125AllPeriods.filter(period => {
                if (!period?.financialYearId) {
                    return false;
                }

                const start =
                    new Date(period.startDate);

                const end =
                    new Date(period.endDate);

                return (
                    d125TargetDate >= start &&
                    d125TargetDate <= end
                );
            });

        console.log(
            "D125 RESOLVER TOTAL PERIODS:",
            d125AllPeriods.length
        );

        console.log(
            "D125 RESOLVER MATCH COUNT:",
            d125Matches.length
        );

        console.log(
            "D125 RESOLVER MATCHES:",
            JSON.stringify(d125Matches, null, 2)
        );

        if (!d125ResolvedPeriod) {
            throw new Error(
                "D125 direct resolver failed for controlled 2030 journal date."
            );
        }

        const session = await getAuthenticatedProfile();

        if (!session) {
            throw new Error(
                "D125 requires an authenticated Firebase session."
            );
        }

        console.log(
            "D125 AUTHENTICATED PROFILE:",
            JSON.stringify(
                session.profile ?? null,
                null,
                2
            )
        );

        const cooperativeId =
            typeof session.profile?.cooperativeId === "string"
                ? session.profile.cooperativeId.trim()
                : null;

        const normalizedRole =
            String(session.profile?.role ?? "")
                .trim()
                .toLowerCase()
                .replace(/[-\s]+/g, "_");

        const isSuperAdmin =
            normalizedRole === "superadmin" ||
            normalizedRole === "super_admin";

        if (!isSuperAdmin && !cooperativeId) {
            throw new Error(
                "D125 authenticated non-Super-Admin profile has no cooperativeId."
            );
        }

        console.log(
            "D125 AUTHENTICATED PROFILE ROLE:",
            session.profile?.role
        );

        console.log(
            "D125 AUTHENTICATED COOPERATIVE ID:",
            cooperativeId
        );

        const baselineCashBook = await generateCashBook();

        if (!baselineCashBook || baselineCashBook.success !== true) {
            throw new Error("Baseline Cash Book generation failed.");
        }

        const baselineReceipts =
            Number(baselineCashBook.totalReceipts || 0);

        const baselinePayments =
            Number(baselineCashBook.totalPayments || 0);

        const baselineTransactions =
            Number(baselineCashBook.totalTransactions || 0);

        const baselineClosingBalance =
            Number(baselineCashBook.closingBalance || 0);

        const transaction = await CMPTransactionEngine.create({
            type: "CONTRIBUTION",
            amount: 10000,
            description: "RC068 Cash Book Integration Contribution",
            transactionDate: d125JournalDate,
            cooperativeId
        });

        if (!transaction || transaction.status !== "POSTED") {
            throw new Error("Expected transaction to be POSTED.");
        }

        const result = await generateCashBook();

        if (!result || result.success !== true) {
            throw new Error("Cash Book generation failed.");
        }

        if (result.account !== "Cash Account") {
            throw new Error(
                `Expected canonical account "Cash Account", received "${result.account}".`
            );
        }

        if (!Array.isArray(result.receipts)) {
            throw new Error("Cash Book receipts must be an array.");
        }

        if (!Array.isArray(result.payments)) {
            throw new Error("Cash Book payments must be an array.");
        }

        if (!Array.isArray(result.transactions)) {
            throw new Error("Cash Book transactions must be an array.");
        }

        const calculatedReceipts = result.receipts.reduce(
            (total, entry) => total + Number(entry.receipt || 0),
            0
        );

        const calculatedPayments = result.payments.reduce(
            (total, entry) => total + Number(entry.payment || 0),
            0
        );

        const expectedReceipts =
            baselineReceipts + 10000;

        const expectedPayments =
            baselinePayments;

        const expectedClosingBalance =
            baselineClosingBalance + 10000;

        const expectedTransactionCount =
            baselineTransactions + 1;

        if (calculatedReceipts !== expectedReceipts) {
            throw new Error(
                `Expected Cash Book receipts of ${expectedReceipts}, received ${calculatedReceipts}.`
            );
        }

        if (calculatedPayments !== expectedPayments) {
            throw new Error(
                `Expected Cash Book payments of ${expectedPayments}, received ${calculatedPayments}.`
            );
        }

        if (Number(result.totalReceipts) !== expectedReceipts) {
            throw new Error(
                `Expected totalReceipts of ${expectedReceipts}, received ${result.totalReceipts}.`
            );
        }

        if (Number(result.totalPayments) !== expectedPayments) {
            throw new Error(
                `Expected totalPayments of ${expectedPayments}, received ${result.totalPayments}.`
            );
        }

        if (Number(result.closingBalance) !== expectedClosingBalance) {
            throw new Error(
                `Expected closingBalance of ${expectedClosingBalance}, received ${result.closingBalance}.`
            );
        }

        if (Number(result.totalTransactions) !== expectedTransactionCount) {
            throw new Error(
                `Expected totalTransactions of ${expectedTransactionCount}, received ${result.totalTransactions}.`
            );
        }

        if (Number(result.totalTransactions) !== result.transactions.length) {
            throw new Error(
                "Transaction count does not reconcile."
            );
        }

        if (result.transactions.length < 1) {
            throw new Error(
                "Expected at least one Cash Book transaction."
            );
        }

        const matchingTransaction = result.transactions.find(
            entry =>
                entry.transactionId === transaction.transactionId
        );

        if (!matchingTransaction) {
            throw new Error(
                "Posted contribution transaction was not found in Cash Book."
            );
        }

        if (Number(matchingTransaction.debit || 0) !== 10000) {
            throw new Error(
                "Cash Book transaction debit does not equal 10000."
            );
        }

        console.log("Seed Chart of Accounts: PASS");
        console.log("Financial Year Creation: PASS");
        console.log("Accounting Period Creation: PASS");
        console.log("Transaction Posting: PASS");
        console.log("Cash Book Generation: PASS");
        console.log("Canonical Account: PASS");
        console.log("Receipt Integration: PASS");
        console.log("Payment Integration: PASS");
        console.log("Closing Balance Integration: PASS");

        if (!result.success) {
    throw new Error(
        "Cash Book generation verification failed."
    );
}

if (result.account !== "Cash Account") {
    throw new Error(
        "Cash Book canonical account verification failed."
    );
}

if (result.receipts.length < 1) {
    throw new Error(
        "Cash Book receipt collection verification failed."
    );
}

if (result.totalReceipts !== expectedReceipts) {
    throw new Error(
        "Cash Book total receipts verification failed."
    );
}

if (result.totalPayments !== expectedPayments) {
    throw new Error(
        "Cash Book total payments verification failed."
    );
}

if (result.closingBalance !== expectedClosingBalance) {
    throw new Error(
        "Cash Book closing balance verification failed."
    );
}

if (result.totalTransactions !== expectedTransactionCount) {
    throw new Error(
        "Cash Book transaction count verification failed."
    );
}

const receiptTotal =
    result.receipts.reduce(
        (sum, item) =>
            sum + Number(item.receipt || 0),
        0
    );

const paymentTotal =
    result.payments.reduce(
        (sum, item) =>
            sum + Number(item.payment || 0),
        0
    );

if (receiptTotal !== result.totalReceipts) {
    throw new Error(
        "Cash Book receipt reconciliation failed."
    );
}

if (paymentTotal !== result.totalPayments) {
    throw new Error(
        "Cash Book payment reconciliation failed."
    );
}

if (
    result.closingBalance !==
    result.totalReceipts -
    result.totalPayments
) {
    throw new Error(
        "Cash Book closing balance calculation failed."
    );
}

console.log("");
console.log("Cash Book Generation Verification: PASS");
console.log("Canonical Account Verification: PASS");
console.log("Receipt Count Verification: PASS");
console.log("Payment Count Verification: PASS");
console.log("Total Receipts Verification: PASS");
console.log("Total Payments Verification: PASS");
console.log("Closing Balance Verification: PASS");
console.log("Transaction Count Verification: PASS");
console.log("Receipt Reconciliation Verification: PASS");
console.log("Payment Reconciliation Verification: PASS");
console.log("Closing Balance Calculation Verification: PASS");
console.log("Cash Book Transaction Integration Verification: PASS");

console.log("Transaction Integration: PASS");
        console.log("");
        console.log("CASH BOOK RESULT:");
        console.log(JSON.stringify(result, null, 4));
        console.log("");
        console.log("=========================================");
        console.log("RC068 TEST COMPLETE: PASS");
        console.log("=========================================");
    } catch (error) {
        console.error("RC068 CASH BOOK TEST: FAIL");
        console.error(error.message);
        process.exitCode = 1;
    }
}

runTest();
