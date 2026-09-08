import {
    applyLoan
}
from "../../../js/services/loanService.js";

loanForm.addEventListener(
    "submit",

    async (e) => {

        e.preventDefault();

        try {

            await applyLoan({
amount:
                Number(
                    document.getElementById(
                        "amount"
                    ).value
                ),

                purpose:
                document.getElementById(
                    "purpose"
                ).value,

                repaymentMonths:
                Number(
                    document.getElementById(
                        "repaymentMonths"
                    ).value
                )

            });

            alert(
                "Loan application submitted successfully."
            );

            loanForm.reset();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to submit loan application."
            );

        }

    }
);