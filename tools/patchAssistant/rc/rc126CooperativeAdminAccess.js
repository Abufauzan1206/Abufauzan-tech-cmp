import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "js/auth.js",
        mode: "regex",
        search: `if \\(userData\\.role === "superAdmin"\\) \\{[\\s\\S]*?\\n\\s*\\}\\s*else \\{[\\s\\S]*?\\n\\s*\\}`,
        replace: `const role = userData.role;

      if (role === "superAdmin" || role === "super_admin") {
        window.location.href = "super-admin.html";
      } else if (role === "cooperative_admin") {
        window.location.href = "cooperative-admin.html";
      } else if (role === "pending_admin") {
        window.location.href = "admin-request.html";
      } else {
        alert("Your account role is not yet configured for dashboard access.");
      }`
    },

    {
        path: "js/components/auth.js",
        mode: "regex",
        search: `static isSuperAdmin\\(\\) \\{[\\s\\S]*?\\n    \\}`,
        replace: `static isSuperAdmin() {
        return this.hasRole("super_admin") ||
               this.hasRole("superAdmin");
    }`
    },

    {
        path: "js/components/auth.js",
        mode: "regex",
        search: `static isCooperativeAdmin\\(\\) \\{[\\s\\S]*?\\n    \\}`,
        replace: `static isCooperativeAdmin() {
        return this.hasRole("cooperative_admin");
    }`
    },

    {
        path: "cooperative-admin.html",
        mode: "create",
        replace: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CMP Cooperative Admin</title>
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/layout.css">
</head>

<body>

<header>
    <div class="logo">ABUFAUZAN TECH CMP</div>

    <div class="profile">
        <span id="adminName">Cooperative Administrator</span>
        <button id="logoutBtn">Logout</button>
    </div>
</header>

<div class="main-container">

    <nav id="sidebarMenu" class="sidebar"></nav>

    <main id="content">

        <div class="dashboard-header">
            <h1>👋 Welcome, Cooperative Administrator</h1>
            <p>
                Manage your cooperative's members, contributions,
                welfare and other cooperative operations.
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
                <h3 id="loanTotal">₦0.00</h3>
                <p>Loans</p>
            </div>

        </div>

        <div class="dashboard-section">

            <h2>⚡ Cooperative Services</h2>

            <div class="service-grid">

                <a href="modules/members/index.html"
                   class="service-card">
                    <div class="service-icon">👥</div>
                    <h3>Members</h3>
                    <p>Manage cooperative members.</p>
                </a>

                <a href="modules/contributions/index.html"
                   class="service-card">
                    <div class="service-icon">💰</div>
                    <h3>Contributions</h3>
                    <p>Manage member contributions.</p>
                </a>

                <a href="modules/contribution-draw/index.html"
                   class="service-card">
                    <div class="service-icon">🎲</div>
                    <h3>Contribution Draw</h3>
                    <p>Manage contribution draw activities.</p>
                </a>

                <a href="modules/loans/loan-directory/index.html"
                   class="service-card">
                    <div class="service-icon">🏦</div>
                    <h3>Loans</h3>
                    <p>Manage cooperative lending.</p>
                </a>

                <a href="modules/welfare/index.html"
                   class="service-card">
                    <div class="service-icon">❤️</div>
                    <h3>Welfare</h3>
                    <p>Manage welfare activities.</p>
                </a>

                <div class="service-card disabled">
                    <div class="service-icon">📈</div>
                    <h3>Investments</h3>
                    <p>Coming Soon</p>
                </div>

                <div class="service-card disabled">
                    <div class="service-icon">🛒</div>
                    <h3>Marketplace</h3>
                    <p>Coming Soon</p>
                </div>

                <div class="service-card disabled">
                    <div class="service-icon">📊</div>
                    <h3>Reports</h3>
                    <p>Coming Soon</p>
                </div>

            </div>

        </div>

        <div class="dashboard-section">

            <h2>📢 Cooperative Activity</h2>

            <div class="card">
                <p>
                    Your cooperative dashboard is ready.
                    Additional operational functions will be connected
                    progressively as the CMP advances through RC1.
                </p>
            </div>

        </div>

    </main>

</div>

<footer>
    © 2026 ABUFAUZAN TECH
</footer>

<script type="module" src="js/cooperative-admin.js"></script>

</body>
</html>`
    },

    {
        path: "js/cooperative-admin.js",
        mode: "create",
        replace: `import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const cooperativeMenu = [
    {
        title: "Dashboard",
        icon: "🏠",
        url: "cooperative-admin.html"
    },
    {
        title: "Members",
        icon: "👥",
        url: "modules/members/index.html"
    },
    {
        title: "Contributions",
        icon: "💰",
        url: "modules/contributions/index.html"
    },
    {
        title: "Contribution Draw",
        icon: "🎲",
        url: "modules/contribution-draw/index.html"
    },
    {
        title: "Loans",
        icon: "🏦",
        url: "modules/loans/loan-directory/index.html"
    },
    {
        title: "Welfare",
        icon: "❤️",
        url: "modules/welfare/index.html"
    },
    {
        title: "Investments",
        icon: "📈",
        url: "#"
    },
    {
        title: "Marketplace",
        icon: "🛒",
        url: "#"
    },
    {
        title: "Reports",
        icon: "📊",
        url: "#"
    }
];

function buildCooperativeSidebar() {

    const container =
        document.getElementById("sidebarMenu");

    if (!container) return;

    container.innerHTML = "";

    cooperativeMenu.forEach(menu => {

        const link =
            document.createElement("a");

        link.href = menu.url;

        link.textContent =
            menu.icon + " " + menu.title;

        link.className = "sidebar-link";

        container.appendChild(link);
    });
}

onAuthStateChanged(auth, async user => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const userDoc =
        await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
        await signOut(auth);
        window.location.href = "login.html";
        return;
    }

    const userData = userDoc.data();

    if (userData.role !== "cooperative_admin") {
        alert("You do not have Cooperative Administrator access.");
        await signOut(auth);
        window.location.href = "login.html";
        return;
    }

    const name =
        userData.name ||
        userData.displayName ||
        user.email ||
        "Cooperative Administrator";

    const adminName =
        document.getElementById("adminName");

    if (adminName) {
        adminName.textContent = name;
    }

    buildCooperativeSidebar();
});

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "login.html";
    });
}`
    },

    {
        path: "admin-request.html",
        mode: "create",
        replace: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Request Cooperative Admin Access</title>
<link rel="stylesheet" href="css/style.css">
</head>

<body class="login-page">

<div class="login-card">

    <h1>🏢 ABUFAUZAN TECH</h1>

    <h2>Request Cooperative Admin Access</h2>

    <p style="color:#64748B;">
        Submit your cooperative details for review by
        the ABUFAUZAN TECH Super Administrator.
    </p>

    <form id="adminRequestForm">

        <input
            type="text"
            id="fullName"
            placeholder="👤 Full Name"
            required>

        <br><br>

        <input
            type="email"
            id="email"
            placeholder="📧 Email Address"
            required>

        <br><br>

        <input
            type="text"
            id="cooperativeName"
            placeholder="🏢 Cooperative Name"
            required>

        <br><br>

        <input
            type="tel"
            id="phone"
            placeholder="📱 Phone Number"
            required>

        <br><br>

        <button
            type="submit"
            class="btn-primary">
            📩 Submit Request
        </button>

    </form>

    <p id="requestStatus"
       style="margin-top:20px;"></p>

    <div style="margin-top:20px;">
        <a href="login.html">← Back to Login</a>
    </div>

    <hr>

    <p class="version">
        Version 2.1.0
        <br>
        © 2026 ABUFAUZAN TECH
    </p>

</div>

<script type="module" src="js/admin-request.js"></script>

</body>
</html>`
    },

    {
        path: "js/admin-request.js",
        mode: "create",
        replace: `import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form =
    document.getElementById("adminRequestForm");

const status =
    document.getElementById("requestStatus");

if (form) {

    form.addEventListener("submit", async event => {

        event.preventDefault();

        status.textContent =
            "Submitting request...";

        try {

            const request = {

                fullName:
                    document.getElementById("fullName")
                    .value.trim(),

                email:
                    document.getElementById("email")
                    .value.trim(),

                cooperativeName:
                    document.getElementById("cooperativeName")
                    .value.trim(),

                phone:
                    document.getElementById("phone")
                    .value.trim(),

                roleRequested:
                    "cooperative_admin",

                status:
                    "pending",

                createdAt:
                    serverTimestamp()
            };

            await addDoc(
                collection(db, "adminRequests"),
                request
            );

            form.reset();

            status.textContent =
                "✅ Request submitted successfully. " +
                "Your request is now awaiting Super Admin review.";

        } catch (error) {

            console.error(error);

            status.textContent =
                "Unable to submit request: " +
                error.message;
        }
    });
}`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC126 - COOPERATIVE ADMIN ACCESS");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC126 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC126 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC126 PATCH COMPLETE");
    console.log("=========================================");
}

run();
