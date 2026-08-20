import { patch } from "../patchEngine.js";

const file = "testFinancialStatementsIntegration.js";

const content = `import { execFileSync } from "child_process";

const tests = [
  {
    name: "Balance Sheet",
    file: "testBalanceSheet.js"
  },
  {
    name: "Income & Expenditure",
    file: "testIncomeExpenditure.js"
  },
  {
    name: "Cash Flow",
    file: "testCashFlow.js"
  },
  {
    name: "Statement of Changes in Equity",
    file: "testStatementOfChangesInEquity.js"
  }
];

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("FINANCIAL STATEMENTS INTEGRATION TEST");
console.log("=========================================");

let allPassed = true;

for (const test of tests) {
  console.log("");
  console.log("-----------------------------------------");
  console.log(test.name);
  console.log("-----------------------------------------");

  try {
    const output = execFileSync(
      process.execPath,
      [test.file],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      }
    );

    process.stdout.write(output);

    console.log(
      test.name + " Integration Verification: PASS"
    );
  } catch (error) {
    allPassed = false;

    if (error.stdout) {
      process.stdout.write(error.stdout);
    }

    if (error.stderr) {
      process.stderr.write(error.stderr);
    }

    console.log(
      test.name + " Integration Verification: FAIL"
    );
  }
}

console.log("");
console.log("=========================================");

if (allPassed) {
  console.log(
    "FINANCIAL STATEMENTS INTEGRATION: PASS"
  );
  console.log(
    "RC084 FINANCIAL STATEMENTS INTEGRATION TEST: PASS"
  );
} else {
  console.log(
    "FINANCIAL STATEMENTS INTEGRATION: FAIL"
  );
  console.log(
    "RC084 FINANCIAL STATEMENTS INTEGRATION TEST: FAIL"
  );
}

console.log("=========================================");

if (!allPassed) {
  process.exitCode = 1;
}
`;

const result = await patch({
  path: file,
  mode: "create",
  replace: content
});

console.log("=========================================");
console.log("FINANCIAL STATEMENTS INTEGRATION PATCH");
console.log("=========================================");
console.log(JSON.stringify(result, null, 2));
console.log("=========================================");
