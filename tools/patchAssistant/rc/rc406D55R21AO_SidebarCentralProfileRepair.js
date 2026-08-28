import { patch } from "../patchEngine.js";

const path = "js/navigation/sidebar.js";

const importSearch = `import { auth, db } from "../firebase-config.js";
import { rolesMatch } from "../components/roleAuthorization.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`;

const importReplace = `import { rolesMatch } from "../components/roleAuthorization.js";
import { enforceDashboardAccess } from "../controllers/accessController.js";`;

const functionSearch = `export function buildAuthenticatedSidebar(containerId) {
    onAuthStateChanged(auth, async user => {
        if (!user) {
            window.location.href = new URL("../../login.html", import.meta.url).href;
            return;
        }

        try {
            const userDoc = await getDoc(
                doc(db, "users", user.uid)
            );

            if (!userDoc.exists()) {
                window.location.href = new URL("../../login.html", import.meta.url).href;
                return;
            }

            const userData = userDoc.data();

            buildSidebar(
                containerId,
                userData.role
            );
        } catch (error) {
            console.error(
                "Sidebar authentication error:",
                error
            );

            window.location.href = new URL("../../login.html", import.meta.url).href;
        }
    });
}`;

const functionReplace = `export async function buildAuthenticatedSidebar(containerId) {
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
}`;

if (!importSearch.includes("getDoc") ||
    !importSearch.includes("doc") ||
    !importSearch.includes("onAuthStateChanged")) {
    throw new Error(
        "RC406-D55R21-AO import target contract invalid; refusing non-deterministic patch."
    );
}

if (!functionSearch.includes("getDoc") ||
    !functionSearch.includes('doc(db, "users", user.uid)') ||
    !functionSearch.includes("userData.role")) {
    throw new Error(
        "RC406-D55R21-AO sidebar function target contract invalid; refusing non-deterministic patch."
    );
}

const importResult = await patch({
    path,
    mode: "exact",
    search: importSearch,
    replace: importReplace
});

const functionResult = await patch({
    path,
    mode: "exact",
    search: functionSearch,
    replace: functionReplace
});

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21-AO — SIDEBAR CENTRAL PROFILE REPAIR");
console.log("===============================================");
console.log("IMPORT PATCH:", importResult);
console.log("FUNCTION PATCH:", functionResult);
console.log("===============================================");
console.log("RC406-D55R21-AO REPAIR COMPLETE");
