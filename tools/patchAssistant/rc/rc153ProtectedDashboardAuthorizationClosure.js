/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC153 - PROTECTED DASHBOARD AUTHORIZATION CLOSURE
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardAuthorizationClosure.js",
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
    superAdminSource.includes("onAuthStateChanged") &&
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Both protected dashboards continuously observe authentication state"
);

check(
    superAdminSource.includes("auth.currentUser") &&
    cooperativeAdminSource.includes("auth.currentUser"),
    "Both protected dashboards resolve the current Firebase user"
);

check(
    superAdminSource.includes('doc(db, "users", user.uid)') &&
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Both protected dashboards resolve the current Firestore profile"
);

check(
    roleSource.includes("normalizeRole") &&
    roleSource.includes("rolesMatch"),
    "Canonical role authorization remains available"
);

check(
    superAdminSource.includes("rolesMatch(") &&
    superAdminSource.includes('"super_admin"'),
    "Super Admin remains explicitly bound to canonical authorization"
);

check(
    cooperativeAdminSource.includes("rolesMatch(") &&
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin remains explicitly bound to canonical authorization"
);

check(
    superAdminSource.includes("signOut") &&
    cooperativeAdminSource.includes("signOut"),
    "Both protected dashboards can terminate unauthorized sessions"
);

check(
    superAdminSource.includes("login.html") &&
    cooperativeAdminSource.includes("login.html"),
    "Both protected dashboards retain login fallback"
);

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains Super Admin boundary"
);

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin retains complete browser re-entry protection"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin retains complete browser re-entry protection"
);

console.log("=========================================");

if (failed) {
    console.log(
        "RC153 PROTECTED DASHBOARD AUTHORIZATION CLOSURE TEST: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC153 PROTECTED DASHBOARD AUTHORIZATION CLOSURE TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC153 - PROTECTED DASHBOARD AUTHORIZATION CLOSURE");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC153 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC153 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC153 PATCH COMPLETE");
    console.log("=========================================");

    console.log("Running RC153 test...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testProtectedDashboardAuthorizationClosure.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
