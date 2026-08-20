import { transaction } from "../patchEngine.js";

const testFile = "testIncomeExpenditure.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC056 - ALIGN INCOME & EXPENDITURE NODE TEST");
    console.log("=========================================");

    const result = await transaction([

        {
            path: testFile,
            mode: "regex",
            search:
                'import \\{ CMPIncomeExpenditureEngine \\} from "\\.\\/js\\/business\\/incomeExpenditureEngine\\.js";',
            replace:
                `import {
    generateIncomeExpenditure
} from "./js/business/incomeExpenditureEngine.js";`
        },

        {
            path: testFile,
            mode: "regex",
            search:
                'CMPTransactionEngine\\.create\\(\\{',
            replace:
                'await CMPTransactionEngine.create({'
        },

        {
            path: testFile,
            mode: "regex",
            search:
                'const report = CMPIncomeExpenditureEngine\\.generate\\(\\);',
            replace:
                `const report =
    await generateIncomeExpenditure();`
        },

        {
            path: testFile,
            mode: "regex",
            search:
                'console\\.log\\(`NET SURPLUS : NGN \\$\\{report\\.surplus\\}`\\);',
            replace:
                `console.log(
    \`NET SURPLUS : NGN \${report.netSurplus}\`
);

if (
    report.netSurplus !==
    report.totalIncome -
    report.totalExpenses
) {

    throw new Error(
        "Net surplus calculation is incorrect."
    );
}

console.log("");
console.log("INCOME & EXPENDITURE TEST: PASS");`
        }

    ]);

    console.log("RC056 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC056 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC056 PATCH COMPLETE");
    console.log("=========================================");
}

run();
