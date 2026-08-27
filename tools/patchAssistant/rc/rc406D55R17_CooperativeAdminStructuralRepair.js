import { transaction } from "../patchEngine.js";

const path = "js/cooperative-admin.js";
const source = await (await import("fs/promises")).readFile(path, "utf8");

const startMarker =
`onAuthStateChanged(auth, async (user) => {`;

const endMarker =
`const logoutBtn =`;

const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);

if (start === -1) {
    throw new Error(
        "RC406-D55R17 ABORTED — Cooperative Admin auth guard start not found."
    );
}

if (end === -1) {
    throw new Error(
        "RC406-D55R17 ABORTED — Cooperative Admin auth guard end not found."
    );
}

const newGuard = `onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const access =
            await enforceDashboardAccess("cooperative_admin");

        if (!access.allowed) {
            return;
        }

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
        }

    } catch (error) {

        console.error(
            "Cooperative Admin authentication error:",
            error
        );

        window.location.href = "login.html";
    }

});


`;

const patches = [
    {
        path,
        search: source.slice(start, end),
        replace: newGuard
    },
    {
        path,
        search:
`import { rolesMatch } from "./components/roleAuthorization.js";`,
        replace:
`import { enforceDashboardAccess } from "./controllers/accessController.js";`
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R17 — COOPERATIVE ADMIN CENTRAL GUARD REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R17 REPAIR FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D55R17 REPAIR COMPLETE"
    );
}
