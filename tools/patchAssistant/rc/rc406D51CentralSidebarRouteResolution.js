import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/navigation/sidebar.js",
        search: `import { rolesMatch } from "../components/roleAuthorization.js";
import { enforceDashboardAccess } from "../controllers/accessController.js";`,
        replace: `import { rolesMatch } from "../components/roleAuthorization.js";
import { enforceDashboardAccess } from "../controllers/accessController.js";

const APP_BASE_URL = new URL(
    "../../",
    import.meta.url
);

function resolveAppRoute(destination) {
    return new URL(
        destination,
        APP_BASE_URL
    ).href;
}`
    },
    {
        path: "js/navigation/sidebar.js",
        search: `function getDashboardUrl(role) {
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
}`,
        replace: `function getDashboardUrl(role) {
    if (rolesMatch(role, "super_admin")) {
        return resolveAppRoute("super-admin.html");
    }

    if (rolesMatch(role, "cooperative_admin")) {
        return resolveAppRoute("cooperative-admin.html");
    }

    if (rolesMatch(role, "member")) {
        return resolveAppRoute(
            "modules/member-portal/index.html"
        );
    }

    return resolveAppRoute("login.html");
}`
    },
    {
        path: "js/navigation/sidebar.js",
        search: `          } else {
              link.href = menu.url;
          }`,
        replace: `          } else {
              link.href = resolveAppRoute(menu.url);
          }`
    },
    {
        path: "js/super-admin.js",
        search: `import { buildSidebar } from "./navigation/sidebar.js";`,
        replace: `import { buildAuthenticatedSidebar } from "./navigation/sidebar.js";`
    },
    {
        path: "js/super-admin.js",
        search: `            buildSidebar(
                "sidebarMenu",
                userData.role
            );`,
        replace: `            await buildAuthenticatedSidebar(
                "sidebarMenu"
            );`
    },
    {
        path: "js/cooperative-admin.js",
        search: `import { buildSidebar } from "./navigation/sidebar.js";`,
        replace: `import { buildAuthenticatedSidebar } from "./navigation/sidebar.js";`
    },
    {
        path: "js/cooperative-admin.js",
        search: `            buildSidebar(
                "sidebarMenu",
                userData.role
            );`,
        replace: `            await buildAuthenticatedSidebar(
                "sidebarMenu"
            );`
    },
    {
        path: "modules/member-portal/member-portal.js",
        search: `import { buildSidebar } from "../../js/navigation/sidebar.js";`,
        replace: `import { buildAuthenticatedSidebar } from "../../js/navigation/sidebar.js";`
    },
    {
        path: "modules/member-portal/member-portal.js",
        search: `          const sidebar = document.getElementById("sidebarMenu");
          if (sidebar) {
              buildSidebar("sidebarMenu", userData.role);
          }`,
        replace: `          const sidebar = document.getElementById("sidebarMenu");
          if (sidebar) {
              await buildAuthenticatedSidebar(
                  "sidebarMenu"
              );
          }`
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D51 — CENTRAL SIDEBAR ROUTE RESOLUTION");
console.log("===============================================");

console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
console.log("RC406-D51 COMPLETE");
console.log("===============================================");
