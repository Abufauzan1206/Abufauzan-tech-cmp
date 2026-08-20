/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC126A - COOPERATIVE ADMIN ACCESS
 *
 * Purpose:
 * 1. Route cooperative admins to their own dashboard.
 * 2. Preserve Super Admin routing.
 * 3. Create the Cooperative Admin dashboard.
 * 4. Create its dedicated authentication guard.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "js/auth.js",
        mode: "regex",
        search: `if \\(userData\\.role === "superAdmin"\\) \\{[\\s\\S]*?\\n\\s*\\}`,
        replace: `if (
            userData.role === "superAdmin" ||
            userData.role === "super_admin"
        ) {
            window.location.href = "super-admin.html";
        } else if (
            userData.role === "cooperativeAdmin" ||
            userData.role === "cooperative_admin"
        ) {
            window.location.href = "cooperative-admin.html";
        }`
    },

    {
        path: "cooperative-admin.html",
        mode: "create",
        search: "",
        replace: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>CMP Cooperative Admin Dashboard</title>

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/layout.css">
</head>

<body>

<header>
    <div class="logo">
        ABUFAUZAN TECH CMP
    </div>

    <div class="profile">
        <span id="adminName">
            Cooperative Administrator
        </span>

        <button id="logoutBtn">
            Logout
        </button>
    </div>
</header>

<div class="main-container">

    <nav id="sidebarMenu" class="sidebar"></nav>

    <main id="content">

        <div class="dashboard-header">

            <h1>
                👋 Welcome, Cooperative Administrator
            </h1>

            <p>
                Manage your cooperative's members,
                contributions, loans, welfare and
                cooperative operations from your
                dedicated dashboard.
            </p>

        </div>

        <div class="stats-grid">

            <div class="stat-card">
                <h2>👥</h2>
                <h3 id="memberCount">0</h3>
                <p>Members</p>
            </div>

            <div class="stat-card">
                <h2>💰</h2>
                <h3 id="contributionTotal">₦0.00</h3>
                <p>Contributions</p>
            </div>

            <div class="stat-card">
                <h2>🏦</h2>
                <h3 id="loanCount">0</h3>
                <p>Loans</p>
            </div>

        </div>

        <div class="dashboard-section">

            <h2>⚡ Cooperative Services</h2>

            <div class="service-grid">

                <a
                    href="modules/members/index.html"
                    class="service-card"
                >
                    <div class="service-icon">👥</div>
                    <h3>Members</h3>
                    <p>
                        Manage cooperative members.
                    </p>
                </a>

                <a
                    href="modules/contributions/index.html"
                    class="service-card"
                >
                    <div class="service-icon">💰</div>
                    <h3>Contributions</h3>
                    <p>
                        Manage member contributions.
                    </p>
                </a>

                <a
                    href="modules/loans/loan-directory/index.html"
                    class="service-card"
                >
                    <div class="service-icon">🏦</div>
                    <h3>Loans</h3>
                    <p>
                        Manage cooperative lending.
                    </p>
                </a>

                <a
                    href="modules/welfare/index.html"
                    class="service-card"
                >
                    <div class="service-icon">❤️</div>
                    <h3>Welfare</h3>
                    <p>
                        Manage welfare operations.
                    </p>
                </a>

                <div class="service-card disabled">
                    <div class="service-icon">📊</div>
                    <h3>Reports</h3>
                    <p>
                        Coming Soon
                    </p>
                </div>

                <div class="service-card disabled">
                    <div class="service-icon">⚙️</div>
                    <h3>Cooperative Settings</h3>
                    <p>
                        Coming Soon
                    </p>
                </div>

            </div>

        </div>

        <div class="dashboard-section">

            <h2>📢 Recent Activities</h2>

            <div class="card">
                <p>
                    No recent activities yet.
                </p>
            </div>

        </div>

    </main>

</div>

<footer>
    © 2026 ABUFAUZAN TECH
</footer>

<script type="module"
    src="js/cooperative-admin.js">
</script>

</body>
</html>
`
    },

    {
        path: "js/cooperative-admin.js",
        mode: "create",
        search: "",
        replace: `import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


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
            userData.role === "cooperativeAdmin" ||
            userData.role === "cooperative_admin";

        if (!allowed) {
            window.location.href =
                userData.role === "superAdmin" ||
                userData.role === "super_admin"
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
`
    }

];


async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC126A - COOPERATIVE ADMIN ACCESS");
    console.log("=========================================");

    const result =
        await transaction(patches);

    console.log(
        "RC126A TRANSACTION RESULT:"
    );

    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {

        process.exitCode = 1;

        console.log(
            "========================================="
        );

        console.log(
            "RC126A PATCH FAIL"
        );

        console.log(
            "========================================="
        );

        return;
    }

    console.log(
        "========================================="
    );

    console.log(
        "RC126A PATCH COMPLETE"
    );

    console.log(
        "========================================="
    );
}

run();
