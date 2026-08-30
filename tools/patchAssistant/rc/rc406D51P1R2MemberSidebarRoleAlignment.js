import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "modules/member-portal/member-portal.js",
        search: `            buildSidebar("sidebarMenu", userData.role);`,
        replace: `            buildSidebar("sidebarMenu", access.role);`
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D51P1R2 — MEMBER SIDEBAR AUTHORITATIVE ROLE ALIGNMENT");
console.log("===============================================");

console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("===============================================");
console.log("RC406-D51P1R2 COMPLETE");
console.log("===============================================");
