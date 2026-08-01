import { CMPTransactionEngine } from "./js/business/transactionEngine.js";
import { CMPLedgerEngine } from "./js/business/ledgerEngine.js";

CMPTransactionEngine.create({

    type: "CONTRIBUTION",
    amount: 10000,
    description: "Monthly Contribution"

});

console.log("Ledger Entries:");

console.log(CMPLedgerEngine.getAll());
