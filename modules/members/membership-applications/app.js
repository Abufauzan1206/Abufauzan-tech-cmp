import { getPendingMembershipApplications } from "../../../js/services/membershipApplicationService.js";
import {
    approveMembershipApplication,
    rejectMembershipApplication
} from "../../../js/services/membershipApplicationService.js";

const applicationsBody =
    document.getElementById("applicationsBody");

const applicationCount =
    document.getElementById("applicationCount");

const applicationMessage =
    document.getElementById("applicationMessage");

let applications = [];

function setMessage(message = "") {
    if (applicationMessage) {
        applicationMessage.textContent = message;
    }
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatSubmittedAt(value) {
    if (!value) {
        return "-";
    }

    if (typeof value?.toDate === "function") {
        return value.toDate().toLocaleString();
    }

    if (typeof value === "string") {
        const date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleString();
        }
    }

    return "-";
}

function renderApplications() {
    if (!applicationsBody) {
        return;
    }

    if (applicationCount) {
        applicationCount.textContent =
            `Pending Applications: ${applications.length}`;
    }

    if (applications.length === 0) {
        applicationsBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No pending membership applications.
                </td>
            </tr>
        `;
        return;
    }

    applicationsBody.innerHTML =
        applications.map(application => {
            const applicantName = [
                application.firstName,
                application.middleName,
                application.lastName
            ]
                .filter(Boolean)
                .join(" ");

            return `
                <tr>
                    <td>${escapeHtml(applicantName)}</td>
                    <td>${escapeHtml(application.phone || "-")}</td>
                    <td>${escapeHtml(application.email || "-")}</td>
                    <td>${escapeHtml(application.applicationId)}</td>
                    <td>🟡 Pending</td>
                    <td>${escapeHtml(
                        formatSubmittedAt(application.submittedAt)
                    )}</td>
                    <td>
                        <button
                            type="button"
                            data-action="approve"
                            data-application-id="${escapeHtml(
                                application.applicationId
                            )}"
                        >
                            Accept
                        </button>

                        <button
                            type="button"
                            data-action="reject"
                            data-application-id="${escapeHtml(
                                application.applicationId
                            )}"
                        >
                            Reject
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
}

async function loadApplications() {
    setMessage("Loading membership applications...");

    if (applicationsBody) {
        applicationsBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Loading applications...
                </td>
            </tr>
        `;
    }

    try {
        applications =
            await getPendingMembershipApplications();

        renderApplications();
        setMessage("");
    } catch (error) {
        console.error(
            "Unable to load membership applications:",
            error
        );

        applications = [];

        if (applicationCount) {
            applicationCount.textContent =
                "Pending Applications: 0";
        }

        if (applicationsBody) {
            applicationsBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        Unable to load membership applications.
                    </td>
                </tr>
            `;
        }

        setMessage(
            error?.message ||
            "Unable to load membership applications."
        );
    }
}

async function handleApprove(applicationId) {
    if (!applicationId) {
        return;
    }

    const confirmed =
        window.confirm(
            "Accept this membership application?"
        );

    if (!confirmed) {
        return;
    }

    setMessage("Accepting membership application...");

    try {
        await approveMembershipApplication(
            applicationId
        );

        setMessage(
            "Membership application accepted."
        );

        await loadApplications();
    } catch (error) {
        console.error(
            "Unable to approve membership application:",
            error
        );

        setMessage(
            error?.message ||
            "Unable to approve membership application."
        );
    }
}

async function handleReject(applicationId) {
    if (!applicationId) {
        return;
    }

    const confirmed =
        window.confirm(
            "Reject this membership application?"
        );

    if (!confirmed) {
        return;
    }

    setMessage("Rejecting membership application...");

    try {
        await rejectMembershipApplication(
            applicationId
        );

        setMessage(
            "Membership application rejected."
        );

        await loadApplications();
    } catch (error) {
        console.error(
            "Unable to reject membership application:",
            error
        );

        setMessage(
            error?.message ||
            "Unable to reject membership application."
        );
    }
}

if (applicationsBody) {
    applicationsBody.addEventListener(
        "click",
        async event => {
            const button =
                event.target.closest(
                    "button[data-action]"
                );

            if (!button) {
                return;
            }

            const applicationId =
                button.dataset.applicationId;

            const action =
                button.dataset.action;

            button.disabled = true;

            try {
                if (action === "approve") {
                    await handleApprove(
                        applicationId
                    );
                }

                if (action === "reject") {
                    await handleReject(
                        applicationId
                    );
                }
            } finally {
                button.disabled = false;
            }
        }
    );
}

loadApplications();
