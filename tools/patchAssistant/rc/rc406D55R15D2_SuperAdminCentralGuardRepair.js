import { transaction } from "../patchEngine.js";

const oldBlock = `onAuthStateChanged(auth, async (user) => {
    
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

const newBlock = `onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const access =
            await enforceDashboardAccess();

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

const importAnchor =
`import { rolesMatch } from "./components/roleAuthorization.js";`;

const importReplacement =
`import { enforceDashboardAccess } from "./controllers/accessController.js";`;

const patches = [
    {
        path: "js/super-admin.js",
        search: importAnchor,
        replace: importReplacement
    },
    {
        path: "js/super-admin.js",
        search: oldBlock,
        replace: newBlock
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R15D2 — SUPER ADMIN CENTRAL GUARD REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R15D2 REPAIR FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D55R15D2 REPAIR COMPLETE"
    );
}
