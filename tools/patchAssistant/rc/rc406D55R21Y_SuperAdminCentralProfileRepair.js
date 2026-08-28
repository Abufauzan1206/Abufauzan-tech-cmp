import { patch } from "../patchEngine.js";

const path = "js/super-admin.js";

const search = `        const access =
            await enforceDashboardAccess();

        if (!access.allowed) {
            return;
        }`;

const replace = `        const access =
            await enforceDashboardAccess();

        if (!access.allowed) {
            return;
        }

        const userData = access.profile;

        const name =
            userData.name ||
            userData.displayName ||
            access.user?.email ||
            "Super Admin";

        const nameElement =
            document.getElementById("adminName");

        if (nameElement) {
            nameElement.textContent = name;
        }`;

if (!search.includes("await enforceDashboardAccess()")) {
    throw new Error(
        "RC406-D55R21-Y target contract invalid; refusing non-deterministic patch."
    );
}

const result = await patch({
    path,
    mode: "exact",
    search,
    replace
});

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21-Y — SUPER ADMIN CENTRAL PROFILE REPAIR");
console.log("===============================================");
console.log(result);
console.log("===============================================");
console.log("RC406-D55R21-Y REPAIR COMPLETE");
