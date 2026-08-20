import { transaction } from "../patchEngine.js";

const periodFile =
    "js/business/accountingPeriodEngine.js";

const coordinatorFile =
    "js/business/financialClosingCoordinator.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC048 - FINANCIAL YEAR / ACCOUNTING PERIOD");
    console.log("=========================================");

    const result = await transaction([

        {
            path: periodFile,
            mode: "regex",

            search:
                'import \\{\\s*createAccountingPeriod,\\s*getAllAccountingPeriods,\\s*updateAccountingPeriod,\\s*getAccountingPeriodById\\s*\\} from "../services/accountingPeriodService\\.js";',

            replace:
`import {
    createAccountingPeriod,
    getAllAccountingPeriods,
    updateAccountingPeriod,
    getAccountingPeriodById
} from "../services/accountingPeriodService.js";

import {
    getFinancialYearById
} from "../services/financialYearService.js";`
        },

        {
            path: periodFile,
            mode: "regex",

            search:
                'export async function createPeriod\\(data\\) \\{\\s*if \\(!data\\?\\.name\\)',

            replace:
`export async function createPeriod(data) {
    if (!data?.name)`
        },

        {
            path: periodFile,
            mode: "regex",

            search:
                'if \\(!data\\?\\.startDate \\|\\| !data\\?\\.endDate\\) \\{',

            replace:
`if (!data?.startDate || !data?.endDate) {`
        },

        {
            path: periodFile,
            mode: "regex",

            search:
                'if \\(\\s*new Date\\(data\\.startDate\\) >=\\s*new Date\\(data\\.endDate\\)\\s*\\) \\{',

            replace:
`if (
        new Date(data.startDate) >=
        new Date(data.endDate)
    ) {`
        },

        {
            path: periodFile,
            mode: "regex",

            search:
                'const periods =\\s*await getAllAccountingPeriods\\(\\);',

            replace:
`if (!data?.financialYearId) {
        throw new Error(
            "Financial year is required."
        );
    }

    const financialYear =
        await getFinancialYearById(
            data.financialYearId
        );

    if (!financialYear) {
        throw new Error(
            "Financial year not found."
        );
    }

    if (
        new Date(data.startDate) <
        new Date(financialYear.startDate) ||
        new Date(data.endDate) >
        new Date(financialYear.endDate)
    ) {
        throw new Error(
            "Accounting period must fall within the financial year."
        );
    }

    const periods =
        await getAllAccountingPeriods();`
        },

        {
            path: periodFile,
            mode: "regex",

            search:
                'name: data\\.name,\\s*startDate: data\\.startDate,',

            replace:
`name: data.name,
        financialYearId:
            data.financialYearId,
        startDate: data.startDate,`
        },

        {
            path: coordinatorFile,
            mode: "regex",

            search:
                'endDate:\\s*nextYearEnd\\s*\\n\\s*\\}\\);',

            replace:
`endDate:
                        nextYearEnd,
                    financialYearId:
                        nextFinancialYear.id
                });`
        }

    ]);

    console.log("RC048 TRANSACTION RESULT:");
    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC048 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC048 PATCH COMPLETE");
    console.log("=========================================");
}

run();
