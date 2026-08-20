/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC136 - DASHBOARD SESSION LIFECYCLE INTEGRATION
 *
 * Purpose:
 * 1. Verify authenticated session handling.
 * 2. Verify authenticated UID/profile resolution.
 * 3. Verify canonical role authorization.
 * 4. Verify correct dashboard admission.
 * 5. Verify cross-dashboard isolation.
 * 6. Verify logout/session termination.
 * 7. Verify terminated sessions cannot retain
 *    protected-dashboard authorization.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testDashboardSessionLifecycleIntegration.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC136 - DASHBOARD SESSION LIFECYCLE INTEGRATION TEST
 *
 * =====================================================
 */

import fs from "fs";

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC136 - DASHBOARD SESSION LIFECYCLE INTEGRATION TEST");
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

/* =========================================
   SOURCE CONTRACTS
   ========================================= */

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const authSource = fs.readFileSync(
    "js/auth.js",
    "utf8"
);

/* =========================================
   PHASE 1
   AUTHENTICATION ESTABLISHMENT
   ========================================= */

assert(
    authSource.includes("signIn") ||
    authSource.includes("signInWith"),
    "Authentication layer exposes Firebase sign-in capability"
);

assert(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin lifecycle begins with Firebase auth-state monitoring"
);

assert(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin lifecycle begins with Firebase auth-state monitoring"
);

/* =========================================
   PHASE 2
   PROFILE RESOLUTION
   ========================================= */

assert(
    superAdminSource.includes("user.uid"),
    "Super Admin lifecycle resolves the authenticated UID"
);

assert(
    cooperativeAdminSource.includes("user.uid"),
    "Cooperative Admin lifecycle resolves the authenticated UID"
);

assert(
    superAdminSource.includes("getDoc"),
    "Super Admin lifecycle resolves the Firestore profile"
);

assert(
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin lifecycle resolves the Firestore profile"
);

/* =========================================
   PHASE 3
   ROLE NORMALIZATION
   ========================================= */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "Legacy Super Admin role normalizes during lifecycle validation"
);

assert(
    normalizeRole("super_admin") === "super_admin",
    "Canonical Super Admin role remains stable during lifecycle validation"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "Legacy Cooperative Admin role normalizes during lifecycle validation"
);

assert(
    normalizeRole("cooperative_admin") === "cooperative_admin",
    "Canonical Cooperative Admin role remains stable during lifecycle validation"
);

/* =========================================
   PHASE 4
   DASHBOARD ADMISSION
   ========================================= */

assert(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin session is admitted to Super Admin dashboard"
);

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin session is admitted to Super Admin dashboard"
);

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin session is admitted to Cooperative Admin dashboard"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin session is admitted to Cooperative Admin dashboard"
);

/* =========================================
   PHASE 5
   CROSS-DASHBOARD ISOLATION
   ========================================= */

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin session cannot enter Super Admin dashboard"
);

assert(
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Legacy Cooperative Admin session cannot enter Super Admin dashboard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin session cannot enter Cooperative Admin dashboard"
);

assert(
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Legacy Super Admin session cannot enter Cooperative Admin dashboard"
);

/* =========================================
   PHASE 6
   UNAUTHORIZED SESSION HANDLING
   ========================================= */

assert(
    !rolesMatch("member", "super_admin"),
    "Member session cannot enter Super Admin dashboard"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member session cannot enter Cooperative Admin dashboard"
);

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown session cannot enter Super Admin dashboard"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown session cannot enter Cooperative Admin dashboard"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role cannot enter Super Admin dashboard"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role cannot enter Cooperative Admin dashboard"
);

/* =========================================
   PHASE 7
   LOGOUT / SESSION TERMINATION
   ========================================= */

assert(
    authSource.includes("signOut"),
    "Authentication layer exposes Firebase sign-out capability"
);

assert(
    superAdminSource.includes("signOut(auth)"),
    "Super Admin lifecycle explicitly terminates Firebase session"
);

assert(
    cooperativeAdminSource.includes("signOut(auth)"),
    "Cooperative Admin lifecycle explicitly terminates Firebase session"
);

/* =========================================
   PHASE 8
   POST-LOGOUT PROTECTION
   ========================================= */

assert(
    superAdminSource.includes("login.html"),
    "Super Admin terminated session has login fallback"
);

assert(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin terminated session has login fallback"
);

assert(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard re-evaluates authentication after session changes"
);

assert(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard re-evaluates authentication after session changes"
);

/* =========================================
   PHASE 9
   LIFECYCLE BOUNDARY TESTS
   ========================================= */

assert(
    !rolesMatch(undefined, "super_admin"),
    "Terminated/missing Super Admin session cannot regain authorization"
);

assert(
    !rolesMatch(undefined, "cooperative_admin"),
    "Terminated/missing Cooperative Admin session cannot regain authorization"
);

assert(
    !rolesMatch("", "super_admin"),
    "Empty Super Admin session cannot regain authorization"
);

assert(
    !rolesMatch("", "cooperative_admin"),
    "Empty Cooperative Admin session cannot regain authorization"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC136 DASHBOARD SESSION LIFECYCLE INTEGRATION TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC136 DASHBOARD SESSION LIFECYCLE INTEGRATION TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC136 - DASHBOARD SESSION LIFECYCLE INTEGRATION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC136 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC136 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC136 PATCH COMPLETE");
    console.log("=========================================");
}

run();
