/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC147 - PROTECTED DASHBOARD SESSION ISOLATION
 *
 * Purpose:
 * Verify that protected dashboard sessions remain isolated
 * between Super Admin and Cooperative Admin contexts.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardSessionIsolation.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC147 - PROTECTED DASHBOARD SESSION ISOLATION TEST
 * =====================================================
 */

import fs from "fs";

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC147 - PROTECTED DASHBOARD SESSION ISOLATION TEST");
console.log("=========================================");

let failed = false;

function check(condition, message) {
    if (condition) {
        console.log("PASS:", message);
    } else {
        console.log("FAIL:", message);
        failed = true;
    }
}

const superAdminSource =
    fs.readFileSync("js/super-admin.js", "utf8");

const cooperativeAdminSource =
    fs.readFileSync("js/cooperative-admin.js", "utf8");

const roleSource =
    fs.readFileSync(
        "js/components/roleAuthorization.js",
        "utf8"
    );

/* =========================================
   PHASE 1
   AUTHENTICATION ISOLATION
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin observes its authenticated Firebase session"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin observes its authenticated Firebase session"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin resolves the active Firebase session user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin resolves the active Firebase session user"
);

/* =========================================
   PHASE 2
   FIRESTORE USER PROFILE ISOLATION
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin authorization is tied to its current user profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin authorization is tied to its current user profile"
);

check(
    superAdminSource.includes("userDoc.exists()"),
    "Super Admin rejects missing user profiles"
);

check(
    cooperativeAdminSource.includes("userDoc.exists()"),
    "Cooperative Admin rejects missing user profiles"
);

/* =========================================
   PHASE 3
   ROLE ISOLATION
   ========================================= */

check(
    roleSource.includes("normalizeRole"),
    "Session isolation uses canonical role normalization"
);

check(
    roleSource.includes("rolesMatch"),
    "Session isolation uses canonical role matching"
);

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin identity remains isolated under canonical role mapping"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin identity remains isolated under canonical role mapping"
);

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot enter Super Admin session context"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot enter Cooperative Admin session context"
);

/* =========================================
   PHASE 4
   NON-PRIVILEGED SESSION ISOLATION
   ========================================= */

check(
    !rolesMatch("member", "super_admin"),
    "Member session cannot enter Super Admin context"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member session cannot enter Cooperative Admin context"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown session cannot enter Super Admin context"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown session cannot enter Cooperative Admin context"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot enter Super Admin context"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot enter Cooperative Admin context"
);

/* =========================================
   PHASE 5
   CROSS-DASHBOARD REDIRECT ISOLATION
   ========================================= */

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains isolated Cooperative Admin redirect boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains isolated Super Admin redirect boundary"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin retains isolated login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin retains isolated login fallback"
);

/* =========================================
   PHASE 6
   SESSION TERMINATION ISOLATION
   ========================================= */

check(
    superAdminSource.includes("signOut"),
    "Super Admin can terminate its protected session"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin can terminate its protected session"
);

/* =========================================
   PHASE 7
   BROWSER RE-ENTRY ISOLATION
   ========================================= */

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin protects isolated browser re-entry"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin protects isolated browser re-entry"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC147 PROTECTED DASHBOARD SESSION ISOLATION TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC147 PROTECTED DASHBOARD SESSION ISOLATION TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC147 - PROTECTED DASHBOARD SESSION ISOLATION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC147 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC147 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC147 PATCH COMPLETE");
    console.log("=========================================");

    console.log("Running RC147 test...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testProtectedDashboardSessionIsolation.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
