import { patch } from "./tools/patchAssistant/patchEngine.js";

const result = await patch({
  path: "tools/patchAssistant/test/createFinancialStatementsIntegration.js",
  search: '  search: "",',
  replace: '  mode: "create",'
});

console.log("=========================================");
console.log("PATCH CREATE MODE");
console.log("=========================================");
console.log(JSON.stringify(result, null, 2));
console.log("=========================================");
