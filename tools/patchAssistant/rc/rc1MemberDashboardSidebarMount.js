import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "modules/member-portal/index.html",
        mode: "exact",
        search: `    <main class="main-container">
        <section id="content">`,
        replace: `    <main class="main-container">
        <nav id="sidebarMenu" class="sidebar"></nav>
        <section id="content">`
    }
];

const result = await transaction(patches);

console.log("================================================");
console.log("RC1 — MEMBER DASHBOARD SIDEBAR MOUNT");
console.log("================================================");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}
