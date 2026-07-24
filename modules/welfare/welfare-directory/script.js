import {
    getWelfareRequests,
    updateWelfareStatus
}
from "../../../js/services/welfareService.js";

const welfareBody =
document.getElementById(
    "welfareBody"
);

const welfareCount =
document.getElementById(
    "welfareCount"
);

window.approveWelfare =
async function(welfareId) {

    await updateWelfareStatus(
        welfareId,
        "Approved"
    );

    alert(
        "Welfare Approved"
    );

    loadWelfare();

};

window.rejectWelfare =
async function(welfareId) {

    await updateWelfareStatus(
        welfareId,
        "Rejected"
    );

    alert(
        "Welfare Rejected"
    );

    loadWelfare();

};

async function loadWelfare() {

    try {

        const requests =
            await getWelfareRequests();

        welfareCount.textContent =
            `❤️ Total Requests: ${requests.length}`;

        if (requests.length === 0) {

            welfareBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No welfare requests found.
                </td>
            </tr>
            `;

            return;

        }

        welfareBody.innerHTML = "";

        requests.forEach(request => {

            welfareBody.innerHTML += `
            <tr>

                <td>
                    ${request.memberId}
                </td>

                <td>
                    ${request.requestType}
                </td>

                <td>
                    ₦${Number(
                        request.amount || 0
                    ).toLocaleString()}
                </td>

                <td>

${
    request.status === "Approved"
    ? "🟢 Approved"

    : request.status === "Rejected"
    ? "🔴 Rejected"

    : "🟡 Pending"
}

</td>

<td>

<button
onclick="approveWelfare('${request.id}')">

🟢 Approve

</button>

<button
onclick="rejectWelfare('${request.id}')">

🔴 Reject

</button>

</td>

            </tr>
            `;

        });

    } catch (error) {

        console.error(error);

        welfareBody.innerHTML = `
        <tr>
            <td colspan="5">
                Error loading welfare requests.
            </td>
        </tr>
        `;

    }

}

loadWelfare();