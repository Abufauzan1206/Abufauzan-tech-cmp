import { getAuthenticatedProfile } from "../../../js/controllers/accessController.js";
import {
    getMemberWelfare,
    getWelfareSummary
} from "../../../js/services/welfareService.js";

const welfareBody =
    document.getElementById("memberWelfareBody");

const welfareSummary =
    document.getElementById("welfareSummary");

async function loadMemberWelfare() {
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

        const [requests, summary] = await Promise.all([
            getMemberWelfare(memberId),
            getWelfareSummary(memberId)
        ]);

        welfareSummary.textContent =
            "Total Requests: " +
            summary.totalRequests +
            " | Total Amount: ₦" +
            Number(
                summary.totalAmount || 0
            ).toLocaleString();

        if (requests.length === 0) {
            welfareBody.innerHTML =
                '<tr><td colspan="4">No welfare records found.</td></tr>';
            return;
        }

        welfareBody.innerHTML = "";

        requests.forEach(request => {
            const row = document.createElement("tr");

            row.innerHTML =
                "<td>" +
                (request.requestType || "—") +
                "</td>" +
                "<td>₦" +
                Number(
                    request.amount || 0
                ).toLocaleString() +
                "</td>" +
                "<td>" +
                (request.reason || "—") +
                "</td>" +
                "<td>" +
                (request.status || "Pending") +
                "</td>";

            welfareBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);

        welfareSummary.textContent =
            "Unable to load your welfare information.";

        welfareBody.innerHTML =
            '<tr><td colspan="4">Error loading welfare records.</td></tr>';
    }
}

loadMemberWelfare();