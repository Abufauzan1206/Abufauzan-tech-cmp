import { auth, db } from "./firebase-config.js";
import { enforceDashboardAccess } from "./controllers/accessController.js";
import { buildSidebar } from "./navigation/sidebar.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


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
            await enforceDashboardAccess("cooperative_admin");

        if (!access.allowed) {
            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        const userDoc = await getDoc(
            doc(db, "users", currentUser.uid)
        );

        if (!userDoc.exists()) {
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }

        const userData = userDoc.data();

        const name =
            userData.name ||
            userData.displayName ||
            user.email ||
            "Cooperative Administrator";

        const nameElement =
            document.getElementById("adminName");

        if (nameElement) {
            nameElement.textContent = name;
        }

        const sidebar =
            document.getElementById("sidebarMenu");

        if (sidebar) {
            buildSidebar(
                "sidebarMenu",
                userData.role
            );
        }

    } catch (error) {

        console.error(
            "Cooperative Admin authentication error:",
            error
        );

        window.location.href = "login.html";
    }

});


const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            await signOut(auth);

            window.location.href =
                "login.html";

        }
    );

}
