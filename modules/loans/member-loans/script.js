import { getAuthenticatedProfile } from "../../../js/controllers/accessController.js";
import {
    getMemberLoans,
    getLoanSummary
} from "../../../js/services/loanService.js";

const loanBody = document.getElementById("memberLoanBody");
const loanSummary = document.getElementById("loanSummary");

async function loadMemberLoans() {
    try {
        const session = await getAuthenticatedProfile();

        if (!session) {
            window.location.href = "../../../login.html";
            return;
        }

        if (session.profile?.role !== "member") {
            alert("Member access required.");
            return;
        }

        const memberId = session.profile?.memberId;

        if (!memberId) {
            throw new Error(
                "Authenticated member profile has no memberId."
            );
        }

        const [loans, summary] = await Promise.all([
            getMemberLoans(memberId),
            getLoanSummary(memberId)
        ]);

        loanSummary.textContent =
            "Total Loans: " + summary.totalLoans +
            " | Total Amount: ₦" +
            Number(summary.totalAmount || 0).toLocaleString();

        if (loans.length === 0) {
            loanBody.innerHTML =
                '<tr><td colspan="4">No loan records found.</td></tr>';
            return;
        }

        loanBody.innerHTML = "";

        loans.forEach(loan => {
            const row = document.createElement("tr");

            const amount = Number(loan.amount || 0)
                .toLocaleString();

            row.innerHTML =
                "<td>₦" + amount + "</td>" +
                "<td>" + (loan.purpose || "—") + "</td>" +
                "<td>" +
                (loan.repaymentMonths || "—") +
                " months</td>" +
                "<td>" +
                (loan.status || "Pending") +
                "</td>";

            loanBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        loanSummary.textContent =
            "Unable to load your loan information.";

        loanBody.innerHTML =
            '<tr><td colspan="4">Error loading loans.</td></tr>';
    }
}

loadMemberLoans();