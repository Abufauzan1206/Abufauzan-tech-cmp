import { transaction } from "../patchEngine.js";

const file =
    "js/business/financialClosingCoordinator.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC047 - OPENING BALANCE POSTING");
    console.log("=========================================");

    const result = await transaction([
        {
            path: file,
            mode: "regex",
            search:
                'import \\{ CMPAuditTrailEngine \\}',
            replace:
                `import {
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
} from "./journalPostingEngine.js";`
        },
        {
            path: file,
            mode: "regex",
            search:
                'const openingBalance =\\s*await CMPOpeningBalanceEngine\\.generate\\(\\);',
            replace:
                `const openingBalance =
            await CMPOpeningBalanceEngine.generate();

        const nextYear =
            Number(year) + 1;

        const nextYearStart =
            \`\${nextYear}-01-01\`;

        const nextYearEnd =
            \`\${nextYear}-12-31\`;

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
                        \`Financial Year \${nextYear}\`,
                    startDate:
                        nextYearStart,
                    endDate:
                        nextYearEnd
                });

            nextAccountingPeriod =
                await createPeriod({
                    name:
                        \`Accounting Period \${nextYear}\`,
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
                        \`OPENING-BALANCE-\${nextYear}\`,
                    entries:
                        openingEntries,
                    createdBy:
                        "SYSTEM"
                });
        }`
        },
        {
            path: file,
            mode: "regex",
            search:
                'openingBalance,\\s*',
            replace:
                `openingBalance,
            openingEntries,
            nextFinancialYear,
            nextAccountingPeriod,
            openingPosting,`
        }
    ]);

    console.log("RC047 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        return;
    }

    console.log("=========================================");
    console.log("RC047 PATCH COMPLETE");
    console.log("=========================================");
}

run();
