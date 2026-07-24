alert("Loan Directory Script Loaded");

import {
    getLoans,
    updateLoanStatus
}
from "../../../js/services/loanService.js";

const loanBody =
document.getElementById(
    "loanBody"
);

const loanCount =
document.getElementById(
    "loanCount"
);

async function loadLoans() {

    try {

        const loans =
            await getLoans();

        loanCount.textContent =
            `🏦 Total Loans: ${loans.length}`;

        if (loans.length === 0) {

            loanBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No loans found.
                </td>
            </tr>
            `;

            return;

        }
        
        window.approveLoan =
async function(loanId) {

    await updateLoanStatus(
        loanId,
        "Approved"
    );

    alert(
        "Loan Approved"
    );

    loadLoans();

};

window.rejectLoan =
async function(loanId) {

    await updateLoanStatus(
        loanId,
        "Rejected"
    );

    alert(
        "Loan Rejected"
    );

    loadLoans();

};

        loanBody.innerHTML = "";

        loans.forEach(loan => {

            loanBody.innerHTML += `
<tr>

    <td>
        ${loan.memberId}
    </td>

    <td>
        ₦${Number(
            loan.amount || 0
        ).toLocaleString()}
    </td>

<td>

${
    loan.status === "Approved"
    ? "🟢 Approved"

    : loan.status === "Rejected"
    ? "🔴 Rejected"

    : "🟡 Pending"
}

</td>

        <button
            onclick="approveLoan('${loan.id}')">

            🟢 Approve

        </button>

        <button
            onclick="rejectLoan('${loan.id}')">

            🔴 Reject

        </button>

    </td>

</tr>
`;

        });

    } catch (error) {

        console.error(error);

        loanBody.innerHTML = `
        <tr>
            <td colspan="3">
                Error loading loans.
            </td>
        </tr>
        `;

    }

}

loadLoans();