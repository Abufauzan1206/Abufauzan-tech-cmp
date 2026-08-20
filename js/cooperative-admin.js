import { auth, db } from "./firebase-config.js";
import { rolesMatch } from "./components/roleAuthorization.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


function handleDashboardHistoryReentry() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

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

        const userDoc = await getDoc(
            doc(db, "users", user.uid)
        );

        if (!userDoc.exists()) {
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }

        const userData = userDoc.data();

        const allowed =
            rolesMatch(
                userData.role,
                "cooperative_admin"
            );

        if (!allowed) {
            window.location.href =
                rolesMatch(
                    userData.role,
                    "super_admin"
                )
                    ? "super-admin.html"
                    : "login.html";

            return;
        }

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
