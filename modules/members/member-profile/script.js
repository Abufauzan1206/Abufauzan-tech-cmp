import { getMemberById }
from "../../../js/services/memberService.js";

import {
    getContributionSummary,
    getMemberContributions
}
from "../../../js/services/contributionService.js";

import {
    getMemberLoans,
    getApprovedLoans
}
from "../../../js/services/loanService.js";

import {
    getMemberWelfare,
    getApprovedWelfare
}
from "../../../js/services/welfareService.js";

// Get member ID from URL
const params = new URLSearchParams(window.location.search);

const memberId = params.get("id");

// Load member
async function loadMember() {

  if (!memberId) {

    alert("No member selected.");

    return;

  }

  try {

    const member = await getMemberById(memberId);

    if (!member) {

      alert("Member not found.");

      return;

    }

    document.getElementById("memberNumber").textContent =
      member.memberNumber || "-";

    document.getElementById("fullName").textContent =
      `${member.firstName} ${member.lastName}`;

    document.getElementById("gender").textContent =
      member.gender || "-";

    document.getElementById("phone").textContent =
      member.phone || "-";

    document.getElementById("email").textContent =
      member.email || "-";

    document.getElementById("cooperative").textContent =
      member.cooperative || "-";
      
      const contributionSummary =
await getContributionSummary(
    memberId
);

document.getElementById(
    "contributionCount"
).textContent =

contributionSummary
.totalContributions;

document.getElementById(
    "contributionAmount"
).textContent =

contributionSummary
.totalAmount
.toLocaleString();

const contributions =
await getMemberContributions(
    memberId
);

const contributionBody =
document.getElementById(
    "contributionBody"
);

if (contributions.length === 0) {

    contributionBody.innerHTML = `
    <tr>
        <td colspan="3">
            No contributions yet.
        </td>
    </tr>
    `;

} else {

    contributionBody.innerHTML = "";

    contributions.forEach(
        contribution => {

            let date = "-";

            if (
                contribution.createdAt?.seconds
            ) {

                date = new Date(
                    contribution.createdAt.seconds * 1000
                ).toLocaleDateString();

            }

            contributionBody.innerHTML += `
            <tr>

                <td>${date}</td>

                <td>
                    ₦${Number(
                        contribution.amount || 0
                    ).toLocaleString()}
                </td>

                <td>
                    ${contribution.paymentMethod || "-"}
                </td>

            </tr>
            `;

        }
    );

}

const memberLoans =
await getMemberLoans(
    memberId
);

const approvedLoans =
await getApprovedLoans(
    memberId
);

const pendingLoans =
memberLoans.filter(

    loan =>

    loan.status === "Pending"

);

const totalLoanAmount =
memberLoans.reduce(

    (sum, loan) =>

        sum +
        Number(
            loan.amount || 0
        ),

    0

);

document.getElementById(
    "loanCount"
).textContent =

memberLoans.length;

document.getElementById(
    "loanAmount"
).textContent =

totalLoanAmount
.toLocaleString();

document.getElementById(
    "approvedLoans"
).textContent =

approvedLoans.length;

const memberWelfare =
await getMemberWelfare(
    member.memberNumber
);

const approvedWelfare =
await getApprovedWelfare(
    member.memberNumber
);

const totalWelfareAmount =
memberWelfare.reduce(

    (sum, request) =>

        sum +
        Number(
            request.amount || 0
        ),

    0

);

document.getElementById(
    "welfareCount"
).textContent =

memberWelfare.length;

document.getElementById(
    "welfareAmount"
).textContent =

totalWelfareAmount
.toLocaleString();

document.getElementById(
    "approvedWelfare"
).textContent =

approvedWelfare.length;

document.getElementById(
    "pendingLoans"
).textContent =

pendingLoans.length;

      const joinedDate =
document.getElementById("joinedDate");

if (member.createdAt?.seconds) {

    joinedDate.textContent =
    new Date(
        member.createdAt.seconds * 1000
    ).toLocaleDateString();

} else {

    joinedDate.textContent = "-";

}
      
      const statusBadge =
document.getElementById("statusBadge");

switch (
    (member.status || "")
    .toLowerCase()
) {

    case "active":

        statusBadge.innerHTML =
        "🟢 Active";

        break;

    case "inactive":

        statusBadge.innerHTML =
        "🔴 Inactive";

        break;

    case "pending":

        statusBadge.innerHTML =
        "🟡 Pending";

        break;

    default:

        statusBadge.innerHTML =
        "🟡 Pending";

}

  } catch (error) {

    console.error(error);

    alert("Unable to load member profile.");

  }

}

loadMember();