import {
    applyLoan
}
from "../../../js/services/loanService.js";

import {
    getMembers
}
from "../../../js/services/memberService.js";

const loanForm =
document.getElementById(
    "loanForm"
);

const memberSelect =
document.getElementById(
    "memberId"
);

async function loadMembers() {

    try {

        const members =
            await getMembers();

        memberSelect.innerHTML =
            '<option value="">Select Member</option>';

        members.forEach(member => {

            memberSelect.innerHTML += `
            <option value="${member.id}">
                ${member.memberNumber} -
                ${member.firstName}
                ${member.lastName}
            </option>
            `;

        });

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load members."
        );

    }

}

loadMembers();

loanForm.addEventListener(
    "submit",

    async (e) => {

        e.preventDefault();

        try {

            await applyLoan({

                memberId:
                memberSelect.value,

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