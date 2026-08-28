import { transaction } from "../patchEngine.js";

const memberPath = "modules/member-portal/member-portal.js";

const oldGuard = `import { auth, db } from "../../js/firebase-config.js";
import { rolesMatch } from "../../js/components/roleAuthorization.js";
import { buildSidebar } from "../../js/navigation/sidebar.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

function redirectToLogin() {
    window.location.href = "../../login.html";
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        redirectToLogin();
        return;
    }

    try {
        const userDoc = await getDoc(
            doc(db, "users", user.uid)
        );

        if (!userDoc.exists()) {
            await signOut(auth);
            redirectToLogin();
            return;
        }

        const userData = userDoc.data();

        if (!rolesMatch(userData.role, "member")) {
            if (rolesMatch(userData.role, "cooperative_admin")) {
                window.location.href = "../../cooperative-admin.html";
            } else if (rolesMatch(userData.role, "super_admin")) {
                window.location.href = "../../super-admin.html";
            } else {
                await signOut(auth);
                redirectToLogin();
            }

            return;
        }

        const memberName =`;

const newGuard = `import { auth } from "../../js/firebase-config.js";
import { buildSidebar } from "../../js/navigation/sidebar.js";
import { enforceDashboardAccess } from "../../js/controllers/accessController.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

function redirectToLogin() {
    window.location.href = "../../login.html";
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        redirectToLogin();
        return;
    }

    try {
        const access =
            await enforceDashboardAccess("member");

        if (!access.allowed) {
            return;
        }

        const userData = access.profile;

        const memberName =`;

const result = await transaction([
    {
        path: memberPath,
        search: oldGuard,
        replace: newGuard
    }
]);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21 — MEMBER PORTAL CENTRALIZATION REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R21 REPAIR FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D55R21 REPAIR COMPLETE"
    );
}
