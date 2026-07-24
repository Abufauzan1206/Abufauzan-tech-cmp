console.log("Contribution script loaded");

import {
    recordContribution
}
from "../../js/services/contributionService.js";

import {
    getMembers
}
from "../../js/services/memberService.js";

const contributionForm =
document.getElementById(
    "contributionForm"
);

const memberSelect =
document.getElementById(
    "memberId"
);

async function loadMembers() {

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

}

loadMembers();

contributionForm.addEventListener(
    "submit",

    async (e) => {

        e.preventDefault();

        try {

            await recordContribution({

                memberId:
                document.getElementById(
                    "memberId"
                ).value,

                amount:
                Number(
                    document.getElementById(
                        "amount"
                    ).value
                ),

                paymentMethod:
                document.getElementById(
                    "paymentMethod"
                ).value,

                status:
                "completed"

            });

            console.log(
    "Contribution recorded successfully."
);

alert(
    "Contribution recorded successfully."
);

           // contributionForm.reset();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to record contribution."
            );

        }

    }
);