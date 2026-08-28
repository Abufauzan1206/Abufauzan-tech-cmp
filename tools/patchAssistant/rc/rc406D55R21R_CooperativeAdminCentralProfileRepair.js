import { patch } from "../patchEngine.js";

const path = "js/cooperative-admin.js";

const search = `        const currentUser = auth.currentUser;

        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        const userDoc = await getDoc(
            doc(db, "users", currentUser.uid)
        );

        if (!userDoc.exists()) {
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }

        const userData = userDoc.data();

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

        const sidebar =
            document.getElementById("sidebarMenu");

        if (sidebar) {
            buildSidebar(
                "sidebarMenu",
                userData.role
            );
        }`;

const replace = `        const userData = access.profile;

        const name =
            userData.name ||
            userData.displayName ||
            access.user?.email ||
            "Cooperative Administrator";

        const nameElement =
            document.getElementById("adminName");

        if (nameElement) {
            nameElement.textContent = name;
        }

        const sidebar =
            document.getElementById("sidebarMenu");

        if (sidebar) {
            buildSidebar(
                "sidebarMenu",
                access.role
            );
        }`;

if (!search.includes("const currentUser = auth.currentUser")) {
    throw new Error(
        "RC406-D55R21-R target contract invalid; refusing non-deterministic patch."
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
console.log("RC406-D55R21-R — COOPERATIVE ADMIN CENTRAL PROFILE REPAIR");
console.log("===============================================");
console.log(result);
console.log("===============================================");
console.log("RC406-D55R21-R REPAIR COMPLETE");
