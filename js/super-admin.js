import { auth, db } from "./firebase-config.js";
import { enforceDashboardAccess } from "./controllers/accessController.js";



import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const functions = getFunctions();
const approveCooperative = httpsCallable(
    functions,
    "approveCooperative"
);

const rejectCooperative = httpsCallable(
    functions,
    "rejectCooperative"
);

function handleDashboardHistoryReentry() {
    window.addEventListener("popstate", () => {
        window.location.reload();
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });

    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            window.location.reload();
        }
    });
}

handleDashboardHistoryReentry();

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const access =
            await enforceDashboardAccess();

        if (!access.allowed) {
            return;
        }

    } catch (error) {

        console.error(
            "Super Admin authorization error:",
            error
        );

        await signOut(auth);
        window.location.href = "login.html";
    }
});


async function loadCooperativeApplications() {
    const container = document.getElementById("cooperativeApplications");

    if (!container) {
        return;
    }

    try {
        const snapshot = await getDocs(
            collection(db, "cooperatives")
        );

        const applications = [];

        snapshot.forEach((document) => {
            const data = document.data();

            if (data.status === "pending") {
                applications.push({
                    id: document.id,
                    ...data
                });
            }
        });

        if (applications.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <p>No pending cooperative applications.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        applications.forEach((application) => {
            const card = document.createElement("div");
            card.className = "card cooperative-application";

            card.innerHTML = `
                <h3>${escapeHtml(application.cooperativeName || "Unnamed Cooperative")}</h3>
                <p><strong>Type:</strong> ${escapeHtml(application.cooperativeType || "N/A")}</p>
                <p><strong>Location:</strong> ${escapeHtml(application.city || "")},
                    ${escapeHtml(application.state || "")},
                    ${escapeHtml(application.country || "")}</p>
                <p><strong>Administrator:</strong> ${escapeHtml(application.administratorName || "N/A")}</p>
                <p><strong>Administrator Email:</strong> ${escapeHtml(application.administratorEmail || "N/A")}</p>
                <p><strong>Official Email:</strong> ${escapeHtml(application.officialEmail || "N/A")}</p>
                <p><strong>Phone:</strong> ${escapeHtml(application.officialPhone || "N/A")}</p>
                <p><strong>Application ID:</strong> ${escapeHtml(application.id)}</p>

                <div class="application-actions">
                    <button type="button" data-action="approve">
                        Approve
                    </button>

                    <button type="button" data-action="reject">
                        Reject
                    </button>
                </div>
            `;

            card.querySelector('[data-action="approve"]')
                .addEventListener("click", () =>
                    approveCooperativeApplication(application.id)
                );

            card.querySelector('[data-action="reject"]')
                .addEventListener("click", () =>
                    rejectCooperativeApplication(application.id)
                );

            container.appendChild(card);
        });

    } catch (error) {
        console.error(
            "Cooperative application loading error:",
            error
        );

        container.innerHTML = `
            <div class="card">
                <p>Unable to load cooperative applications.</p>
            </div>
        `;
    }
}

async function approveCooperativeApplication(cooperativeId) {
    const confirmed = window.confirm(
        "Are you sure you want to approve this cooperative application?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const result = await approveCooperative({
            cooperativeId
        });

        const data = result.data || {};

        alert(
            data.message ||
            "Cooperative application approved."
        );

        await loadCooperativeApplications();

    } catch (error) {
        console.error(
            "Cooperative approval error:",
            error
        );

        alert(
            "Unable to approve cooperative application: " +
            (error.message || "Unknown error.")
        );
    }
}

async function rejectCooperativeApplication(cooperativeId) {
    const confirmed = window.confirm(
        "Are you sure you want to reject this cooperative application?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const result = await rejectCooperative({
            cooperativeId
        });

        const data = result.data || {};

        alert(
            data.message ||
            "Cooperative application rejected."
        );

        await loadCooperativeApplications();

    } catch (error) {
        console.error(
            "Cooperative rejection error:",
            error
        );

        alert(
            "Unable to reject cooperative application: " +
            (error.message || "Unknown error.")
        );
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document.getElementById("logoutBtn").addEventListener("click", async () => {

  await signOut(auth);

  alert("Logged out successfully.");

  window.location.href = "login.html";

});

loadCooperativeApplications();
