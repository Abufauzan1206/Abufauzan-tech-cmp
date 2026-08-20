import { CMPChartOfAccountsEngine }
from "./js/business/chartOfAccountsEngine.js";

CMPChartOfAccountsEngine.createAccount({

    code: "1000",
    name: "Cash Account",
    category: "ASSET"

});

CMPChartOfAccountsEngine.createAccount({

    code: "4000",
    name: "Contribution Income",
    category: "INCOME"

});

console.log("Chart of Accounts:");

console.log(
    CMPChartOfAccountsEngine.getAllAccounts()
);
