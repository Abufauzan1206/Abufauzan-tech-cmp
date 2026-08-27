import fs from "fs/promises";
import { transaction } from "../patchEngine.js";

const path = "js/super-admin.js";
const source = await fs.readFile(path, "utf8");

const startMarker =
`onAuthStateChanged(auth, async (user) => {`;

const endMarker =
`async function loadCooperativeApplications() {`;

const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);

if (start === -1) {
    throw new Error(
        "RC406-D55R15D4 ABORTED — Super Admin auth guard start not found."
    );
}

if (end === -1) {
    throw new Error(
        "RC406-D55R15D4 ABORTED — Super Admin auth guard end not found."
    );
}

const newGuard = `onAuthStateChanged(auth, async (user) => {

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
});


`;

const replacement =
    source.slice(0, start) +
    newGuard +
    source.slice(end);

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
console.log("RC406-D55R15D4 — SUPER ADMIN STRUCTURAL GUARD REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R15D4 REPAIR FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D55R15D4 REPAIR COMPLETE"
    );
}
