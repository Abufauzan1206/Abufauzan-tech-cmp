import { rolesMatch } from "../components/roleAuthorization.js";
import { enforceDashboardAccess } from "../controllers/accessController.js";

function getDashboardUrl(role) {
    if (rolesMatch(role, "super_admin")) {
        return "super-admin.html";
    }

    if (rolesMatch(role, "cooperative_admin")) {
        return "cooperative-admin.html";
    }

    if (rolesMatch(role, "member")) {
        return "modules/member-portal/index.html";
    }

    return "login.html";
}

function getMenuItems(role) {
    if (rolesMatch(role, "super_admin")) {
        return [
            {
                title: "Register Cooperative",
                icon: "🏢",
                url: "register-cooperative.html"
            },
            {
                title: "Cooperatives",
                icon: "🏢",
                url: "super-admin.html#cooperativeApplicationsSection"
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
            },
            {
                title: "Users",
                icon: "👤",
                url: "#"
            },
            {
                title: "Settings",
                icon: "⚙️",
                url: "#"
            }
        ];
    }

    if (rolesMatch(role, "cooperative_admin")) {
        return [
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
                title: "Reports",
                icon: "📊",
                url: "#"
            },
            {
                title: "Settings",
                icon: "⚙️",
                url: "#"
            }
        ];
    }

    if (rolesMatch(role, "member")) {
        return [
            {
                title: "My Profile",
                icon: "👤",
                url: "modules/members/member-profile/index.html"
            },
            {
                title: "My Contributions",
                icon: "💰",
                url: "modules/contributions/index.html"
            },
            {
                title: "My Loans",
                icon: "🏦",
                url: "modules/loans/loan-directory/index.html"
            },
            {
                title: "Welfare",
                icon: "❤️",
                url: "modules/welfare/welfare-directory/index.html"
            },
            {
                title: "Statements",
                icon: "📄",
                url: "#",
                disabled: true
            }
        ];
    }

    return [];
}

export function buildSidebar(containerId, role = null) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const dashboardLink = document.createElement("a");

    dashboardLink.href = getDashboardUrl(role);
    dashboardLink.textContent = "🏠 Dashboard";
    dashboardLink.className = "sidebar-link";

    container.appendChild(dashboardLink);

    const menuItems = getMenuItems(role);

    menuItems.forEach(menu => {
        const link = document.createElement("a");

        link.textContent = `${menu.icon} ${menu.title}`;
        link.className = "sidebar-link";

        if (menu.disabled || menu.url === "#") {
            link.href = "#";
            link.classList.add("disabled");
            link.setAttribute("aria-disabled", "true");
            link.title = "Coming Soon";

            link.addEventListener("click", event => {
                event.preventDefault();
            });
        } else {
            link.href = menu.url;
        }

        container.appendChild(link);
    });
}

export async function buildAuthenticatedSidebar(containerId) {
    try {
        const access =
            await enforceDashboardAccess();

        if (!access.allowed) {
            return;
        }

        buildSidebar(
            containerId,
            access.role
        );
    } catch (error) {
        console.error(
            "Sidebar access error:",
            error
        );
    }
}
