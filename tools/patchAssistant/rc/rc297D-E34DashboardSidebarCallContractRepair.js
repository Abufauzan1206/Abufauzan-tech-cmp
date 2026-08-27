import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/cooperative-admin.js",
        search: 'import { buildAuthenticatedSidebar } from "./navigation/sidebar.js";',
        replace: 'import { buildSidebar } from "./navigation/sidebar.js";'
    },
    {
        path: "js/cooperative-admin.js",
        search: 'buildAuthenticatedSidebar(sidebar, userData.role);',
        replace: 'buildSidebar("sidebarMenu", userData.role);'
    },
    {
        path: "modules/member-portal/member-portal.js",
        search: 'import { buildAuthenticatedSidebar } from "../../js/navigation/sidebar.js";',
        replace: 'import { buildSidebar } from "../../js/navigation/sidebar.js";'
    },
    {
        path: "modules/member-portal/member-portal.js",
        search: 'buildAuthenticatedSidebar(sidebar, userData.role);',
        replace: 'buildSidebar("sidebarMenu", userData.role);'
    }
];

const result = await transaction(patches);

console.log("================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC297D-E34 — DASHBOARD SIDEBAR CALL CONTRACT REPAIR");
console.log("================================================");
console.log(JSON.stringify(result, null, 2));
console.log("================================================");

if (!result || result.success === false) {
    console.log("RC297D-E34 REPAIR FAILED — TRANSACTION ROLLED BACK");
    process.exitCode = 1;
} else {
    console.log("RC297D-E34 REPAIR COMPLETE");
}
