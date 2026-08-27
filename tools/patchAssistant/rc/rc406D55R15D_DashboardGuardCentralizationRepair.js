import { transaction } from "../patchEngine.js";

const superOldGuard = `onAuthStateChanged(auth, async (user) => {
    
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const currentUser = auth.currentUser;

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

        if (!rolesMatch(userData.role, "super_admin")) {

            window.location.href =
                rolesMatch(userData.role, "cooperative_admin")
                    ? "cooperative-admin.html"
                    : "login.html";

            return;
        }


    } catch (error) {

        console.error(
            "Super Admin authorization error:",
            error
        );

        await signOut(auth);
        window.location.href = "login.html";
    }
});`;

const superNewGuard = `import { enforceDashboardAccess } from "./controllers/accessController.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const access = await enforceDashboardAccess();

        if (!access.allowed) {
            return;
        }

    } catch (error) {

        console.error(
            "Super Admin authorization error:",
            error
        );

        await signOut(auth);
        window.location.href = "login.html";
    }
});`;

const cooperativeOldGuard = `const dashboardRole = "cooperative_admin";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const currentUser = auth.currentUser;

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

        const allowed =
            rolesMatch(
                userData.role,
                "cooperative_admin"
            );

        if (!allowed) {
            window.location.href =
                rolesMatch(
                    userData.role,
                    "super_admin"
                )
                    ? "super-admin.html"
                    : "login.html";

            return;
        }`;

const cooperativeNewGuard = `const dashboardRole = "cooperative_admin";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const access =
            await enforceDashboardAccess(
                dashboardRole
            );

        if (!access.allowed) {
            return;
        }`;

const memberOldGuard = `onAuthStateChanged(auth, async (user) => {

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

const memberNewGuard = `import {
    enforceDashboardAccess
} from "../../js/controllers/accessController.js";

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

        const memberName =`;

const patches = [
    {
        path: "js/super-admin.js",
        search: superOldGuard,
        replace: superNewGuard
    },
    {
        path: "js/cooperative-admin.js",
        search: cooperativeOldGuard,
        replace: cooperativeNewGuard
    },
    {
        path: "modules/member-portal/member-portal.js",
        search: memberOldGuard,
        replace: memberNewGuard
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R15D — DASHBOARD GUARD CENTRALIZATION REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R15D REPAIR FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D55R15D REPAIR COMPLETE"
    );
}
