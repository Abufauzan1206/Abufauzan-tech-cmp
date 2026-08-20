import { patch } from "../patchEngine.js";

const file = "js/business/journalBuilderEngine.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC070I - ADD EXPENSE JOURNAL BUILDER");
    console.log("=========================================");

    try {
        const result = await patch({
            path: file,
            search: `                    default:
                        throw new Error(
                            \`No journal builder found for transaction type: \${transaction.type}\`
                        );`,
            replace: `            case "EXPENSE":
                return {
                    title:
                        "Expense Payment",
                    description:
                        transaction.description ??
                        "Expense Payment",
                    date:
                        transaction.transactionDate,
                    reference:
                        transaction.transactionId,
                    entries: [
                        {
                            account:
                                "Office Expense",
                            debit:
                                transaction.amount,
                            credit:
                                0,
                            transactionId:
                                transaction.transactionId
                        },
                        {
                            account:
                                "Bank Account",
                            debit:
                                0,
                            credit:
                                transaction.amount,
                            transactionId:
                                transaction.transactionId
                        }
                    ]
                };

            default:
                throw new Error(
                    \`No journal builder found for transaction type: \${transaction.type}\`
                );`
        });

        console.log("EXPENSE JOURNAL BUILDER: PASS");
        console.log(result);
        console.log("=========================================");
        console.log("RC070I COMPLETE");
        console.log("=========================================");
    } catch (error) {
        console.log("PATCH FAIL");
        console.log(error.message);
        process.exitCode = 1;
    }
}

run();
