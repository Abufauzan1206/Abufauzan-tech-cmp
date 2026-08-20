import { patch } from "../patchEngine.js";

const file = "testIncomeExpenditure.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC057 - ALIGN INCOME & EXPENDITURE FIELDS");
    console.log("=========================================");

    const result = await patch({

        path: file,

        mode: "regex",

        search:
            'report\\.income\\.forEach',

        replace:
            'report.incomeAccounts.forEach'

    });

    if (!result.success) {

        console.log("RC057 PATCH FAIL");
        console.log(result);

        process.exitCode = 1;
        return;

    }

    const second = await patch({

        path: file,

        mode: "regex",

        search:
            'report\\.expenses\\.forEach',

        replace:
            'report.expenseAccounts.forEach'

    });

    if (!second.success) {

        console.log("RC057 PATCH FAIL");
        console.log(second);

        process.exitCode = 1;
        return;

    }

    console.log("RC057 PATCH COMPLETE");
    console.log({
        incomeField: "incomeAccounts",
        expenseField: "expenseAccounts"
    });

}

run();
