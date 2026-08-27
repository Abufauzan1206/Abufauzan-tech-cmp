import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/cooperative-admin.js",
        mode: "regex",
        search: 'onAuthStateChanged\\(auth, async \\(user\\) => \\{',
        replace: `const dashboardRole = "cooperative_admin";

onAuthStateChanged(auth, async (user) => {`
    },
    {
        path: "js/cooperative-admin.js",
        mode: "regex",
        search: 'if \\(nameElement\\) \\{\\s*nameElement\\.textContent = name;\\s*\\}',
        replace: `if (nameElement) {
            nameElement.textContent = name;
        }

        const sidebar = document.getElementById("sidebarMenu");
        if (sidebar) {
            buildAuthenticatedSidebar(sidebar, userData.role);
        }`
    },
    {
        path: "modules/member-portal/member-portal.js",
        mode: "regex",
        search: 'if \\(memberIdElement\\) \\{\\s*memberIdElement\\.textContent =\\s*userData\\.memberId \\|\\| "—";\\s*\\}',
        replace: `if (memberIdElement) {
            memberIdElement.textContent =
                userData.memberId || "—";
        }

        const sidebar = document.getElementById("sidebarMenu");
        if (sidebar) {
            buildAuthenticatedSidebar(sidebar, userData.role);
        }`
    },
    {
        path: "modules/member-portal/member-portal.js",
        mode: "regex",
        search: 'import \\{ rolesMatch \\} from "\\.\\./\\.\\./js/components/roleAuthorization\\.js";',
        replace: `import { rolesMatch } from "../../js/components/roleAuthorization.js";
import { buildAuthenticatedSidebar } from "../../js/navigation/sidebar.js";`
    }
];

const result = await transaction(patches);

console.log("================================================");
console.log("RC1 — DASHBOARD IMPLEMENTATION PATCH");
console.log("================================================");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}
