/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC128 - DASHBOARD ROLE AUTHORIZATION INTEGRATION
 *
 * Purpose:
 * 1. Protect Super Admin dashboard by canonical role.
 * 2. Protect Cooperative Admin dashboard by canonical role.
 * 3. Reuse RC127 roleAuthorization service.
 * 4. Preserve legacy role aliases.
 * 5. Add dashboard authorization integration test.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "js/super-admin.js",
        mode: "regex",
        search: `import \\{ auth \\} from "\\./firebase-config\\.js";`,
        replace: `import { auth, db } from "./firebase-config.js";
import { rolesMatch } from "./components/roleAuthorization.js";`
    },

    {
        path: "js/super-admin.js",
        mode: "regex",
        search: `import \\{\\s*signOut,\\s*onAuthStateChanged\\s*\\} from "https://www\\.gstatic\\.com/firebasejs/12\\.0\\.0/firebase-auth\\.js";`,
        replace: `import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`
    },

    {
        path: "js/super-admin.js",
        mode: "regex",
        search: `onAuthStateChanged\\(auth, \\(user\\) => \\{[\\s\\S]*?\\n\\}\\);`,
        replace: `onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const userDoc = await getDoc(
            doc(db, "users", user.uid)
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

        buildSidebar("sidebarMenu");

    } catch (error) {

        console.error(
            "Super Admin authorization error:",
            error
        );

        await signOut(auth);
        window.location.href = "login.html";
    }
});`
    },

    {
        path: "js/cooperative-admin.js",
        mode: "regex",
        search: `import \\{ auth, db \\} from "\\./firebase-config\\.js";`,
        replace: `import { auth, db } from "./firebase-config.js";
import { rolesMatch } from "./components/roleAuthorization.js";`
    },

    {
        path: "js/cooperative-admin.js",
        mode: "regex",
        search: `const allowed =\\s*userData\\.role === "cooperativeAdmin" \\|\\|\\s*userData\\.role === "cooperative_admin";`,
        replace: `const allowed =
            rolesMatch(
                userData.role,
                "cooperative_admin"
            );`
    },

    {
        path: "js/cooperative-admin.js",
        mode: "regex",
        search: `userData\\.role === "superAdmin" \\|\\|\\s*userData\\.role === "super_admin"`,
        replace: `rolesMatch(
                    userData.role,
                    "super_admin"
                )`
    },

    {
        path: "tools/patchAssistant/test/testDashboardRoleAuthorization.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC128 - DASHBOARD ROLE AUTHORIZATION TEST
 *
 * =====================================================
 */

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC128 - DASHBOARD ROLE AUTHORIZATION TEST");
console.log("=========================================");

let failed = false;

function assert(condition, message) {

    if (condition) {
        console.log("PASS:", message);
    } else {
        console.log("FAIL:", message);
        failed = true;
    }
}

assert(
    normalizeRole("superAdmin") === "super_admin",
    "superAdmin normalizes to super_admin"
);

assert(
    normalizeRole("super_admin") === "super_admin",
    "super_admin remains super_admin"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "cooperativeAdmin normalizes to cooperative_admin"
);

assert(
    normalizeRole("cooperative_admin") === "cooperative_admin",
    "cooperative_admin remains cooperative_admin"
);

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Super Admin legacy alias authorizes Super Admin dashboard"
);

assert(
    rolesMatch("super_admin", "superAdmin"),
    "Canonical Super Admin role authorizes Super Admin dashboard"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Cooperative Admin legacy alias authorizes Cooperative Admin dashboard"
);

assert(
    rolesMatch("cooperative_admin", "cooperativeAdmin"),
    "Canonical Cooperative Admin role authorizes Cooperative Admin dashboard"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot authorize Super Admin dashboard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot authorize Cooperative Admin dashboard"
);

assert(
    rolesMatch("member", "member"),
    "Member remains authorized only as member"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member cannot authorize Super Admin dashboard"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot authorize Cooperative Admin dashboard"
);

console.log("=========================================");

if (failed) {

    console.log(
        "RC128 DASHBOARD ROLE AUTHORIZATION TEST: FAIL"
    );

    process.exitCode = 1;

} else {

    console.log(
        "RC128 DASHBOARD ROLE AUTHORIZATION TEST: PASS"
    );
}

console.log("=========================================");
`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC128 - DASHBOARD ROLE AUTHORIZATION INTEGRATION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC128 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC128 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC128 PATCH COMPLETE");
    console.log("=========================================");
}

run();
