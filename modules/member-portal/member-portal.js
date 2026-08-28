import { auth } from "../../js/firebase-config.js";
import { buildSidebar } from "../../js/navigation/sidebar.js";
import { enforceDashboardAccess } from "../../js/controllers/accessController.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

function redirectToLogin() {
    window.location.href = "../../login.html";
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        redirectToLogin();
        return;
    }

    try {
        const access =
            await enforceDashboardAccess("member");

        if (!access.allowed) {
            return;
        }

        const userData = access.profile;

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
