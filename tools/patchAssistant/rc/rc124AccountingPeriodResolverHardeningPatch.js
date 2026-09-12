import { transaction } from "../patchEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC406-D124 - ACCOUNTING PERIOD RESOLVER HARDENING");
    console.log("=========================================");

    const result = await transaction([
        {
            path: "js/services/accountingPeriodService.js",
            mode: "exact",
            search: `export async function getAccountingPeriodByDate(date) {

    const periods =
        await getAllAccountingPeriods();

    const targetDate =
        new Date(date);

    return periods.find(period => {

        const start =
            new Date(period.startDate);

        const end =
            new Date(period.endDate);

        return (
            targetDate >= start &&
            targetDate <= end
        );

    }) ?? null;

}`,
            replace: `export async function getAccountingPeriodByDate(date) {

    const periods =
        await getAllAccountingPeriods();

    const targetDate =
        new Date(date);

    const matches =
        periods.filter(period => {

            if (!period?.financialYearId) {
                return false;
            }

            const start =
                new Date(period.startDate);

            const end =
                new Date(period.endDate);

            return (
                targetDate >= start &&
                targetDate <= end
            );
        });

    if (matches.length !== 1) {
        return null;
    }

    return matches[0];

}`
        }
    ]);

    console.log("RC124 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC124 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC124 PATCH COMPLETE");
    console.log("=========================================");
}

run();
