import { auth, db } from "../../js/firebase-config.js";
import { rolesMatch } from "../../js/components/roleAuthorization.js";
import { buildSidebar } from "../../js/navigation/sidebar.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

function redirectToLogin() {
    window.location.href = "../../login.html";
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        redirectToLogin();
        return;
    }

    try {
        const userDoc = await getDoc(
            doc(db, "users", user.uid)
        );

        if (!userDoc.exists()) {
            await signOut(auth);
            redirectToLogin();
            return;
        }

        const userData = userDoc.data();

        if (!rolesMatch(userData.role, "member")) {
            if (rolesMatch(userData.role, "cooperative_admin")) {
                window.location.href = "../../cooperative-admin.html";
            } else if (rolesMatch(userData.role, "super_admin")) {
                window.location.href = "../../super-admin.html";
            } else {
                await signOut(auth);
                redirectToLogin();
            }

            return;
        }

        const memberName =
            userData.name ||
            userData.displayName ||
            user.email ||
            "Member";

        const memberNameElement =
            document.getElementById("memberName");

        if (memberNameElement) {
            memberNameElement.textContent = memberName;
        }

        const memberIdElement =
            document.getElementById("memberId");

        if (memberIdElement) {
            memberIdElement.textContent =
                userData.memberId || "—";
        }

        const sidebar = document.getElementById("sidebarMenu");
        if (sidebar) {
            buildSidebar("sidebarMenu", userData.role);
        }

    } catch (error) {
        console.error(
            "Member Portal authentication error:",
            error
        );

        await signOut(auth);
        redirectToLogin();
    }
});

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            redirectToLogin();
        } catch (error) {
            console.error(
                "Member logout error:",
                error
            );
        }
    });
}
