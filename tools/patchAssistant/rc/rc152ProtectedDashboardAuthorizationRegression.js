/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC152 - PROTECTED DASHBOARD AUTHORIZATION REGRESSION
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardAuthorizationRegression.js",
        mode: "create",
        search: "",
        replace: `import fs from "fs";

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const roleSource = fs.readFileSync(
    "js/components/roleAuthorization.js",
    "utf8"
);

let failed = false;

function check(condition, message) {
    if (condition) {
        console.log("PASS: " + message);
    } else {
        console.log("FAIL: " + message);
        failed = true;
    }
}

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin authentication guard remains active"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin authentication guard remains active"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin remains bound to the current authenticated user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin remains bound to the current authenticated user"
);

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin remains bound to the current Firestore profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin remains bound to the current Firestore profile"
);

check(
    roleSource.includes("normalizeRole") &&
    roleSource.includes("rolesMatch"),
    "Canonical authorization layer remains intact"
);

check(
    superAdminSource.includes("rolesMatch(") &&
    superAdminSource.includes('"super_admin"'),
    "Super Admin canonical authorization remains intact"
);

check(
    cooperativeAdminSource.includes("rolesMatch(") &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin canonical authorization remains intact"
);

check(
    superAdminSource.includes("signOut") &&
    cooperativeAdminSource.includes("signOut"),
    "Protected dashboards retain session termination"
);

check(
    superAdminSource.includes("login.html") &&
    cooperativeAdminSource.includes("login.html"),
    "Protected dashboards retain login fallback"
);

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin redirect boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains Super Admin redirect boundary"
);

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin retains browser history re-entry protection"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin retains browser history re-entry protection"
);

console.log("=========================================");

if (failed) {
    console.log(
        "RC152 PROTECTED DASHBOARD AUTHORIZATION REGRESSION TEST: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC152 PROTECTED DASHBOARD AUTHORIZATION REGRESSION TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC152 - PROTECTED DASHBOARD AUTHORIZATION REGRESSION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC152 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC152 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC152 PATCH COMPLETE");
    console.log("=========================================");

    console.log("Running RC152 test...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testProtectedDashboardAuthorizationRegression.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
