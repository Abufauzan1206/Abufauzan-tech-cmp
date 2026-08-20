/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC137 - PROTECTED DASHBOARD REFRESH & RE-ENTRY
 *
 * Purpose:
 * 1. Verify Firebase authentication is re-evaluated
 *    when a protected dashboard is loaded/refreshed.
 * 2. Verify the authenticated UID is used to reload
 *    the Firestore profile.
 * 3. Verify the user's role is normalized again.
 * 4. Verify authorized users can re-enter the correct
 *    dashboard after refresh.
 * 5. Verify cross-dashboard access remains blocked.
 * 6. Verify invalid/missing roles cannot bypass guards.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardRefreshReentry.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC137 - PROTECTED DASHBOARD REFRESH & RE-ENTRY TEST
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
console.log("RC137 - PROTECTED DASHBOARD REFRESH & RE-ENTRY TEST");
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
   SOURCE LOADING
   ========================================= */

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

/* =========================================
   PHASE 1
   REFRESH / AUTH STATE RE-EVALUATION
   ========================================= */

assert(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard re-evaluates Firebase authentication state on re-entry"
);

assert(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard re-evaluates Firebase authentication state on re-entry"
);

/* =========================================
   PHASE 2
   AUTHENTICATED UID RELOAD
   ========================================= */

assert(
    superAdminSource.includes("user.uid"),
    "Super Admin refresh lifecycle uses authenticated Firebase UID"
);

assert(
    cooperativeAdminSource.includes("user.uid"),
    "Cooperative Admin refresh lifecycle uses authenticated Firebase UID"
);

/* =========================================
   PHASE 3
   FIRESTORE PROFILE RELOAD
   ========================================= */

assert(
    superAdminSource.includes("getDoc"),
    "Super Admin refresh lifecycle reloads the Firestore user profile"
);

assert(
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin refresh lifecycle reloads the Firestore user profile"
);

/* =========================================
   PHASE 4
   ROLE AUTHORIZATION SOURCE
   ========================================= */

assert(
    superAdminSource.includes("rolesMatch") ||
    superAdminSource.includes("normalizeRole"),
    "Super Admin refresh lifecycle uses canonical role authorization"
);

assert(
    cooperativeAdminSource.includes("rolesMatch") ||
    cooperativeAdminSource.includes("normalizeRole"),
    "Cooperative Admin refresh lifecycle uses canonical role authorization"
);

assert(
    roleSource.includes("normalizeRole"),
    "Role authorization layer exposes canonical role normalization"
);

assert(
    roleSource.includes("rolesMatch"),
    "Role authorization layer exposes canonical role matching"
);

/* =========================================
   PHASE 5
   CANONICAL ROLE RE-ENTRY
   ========================================= */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "Legacy Super Admin role remains canonical after refresh"
);

assert(
    normalizeRole("super_admin") === "super_admin",
    "Canonical Super Admin role remains stable after refresh"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "Legacy Cooperative Admin role remains canonical after refresh"
);

assert(
    normalizeRole("cooperative_admin") === "cooperative_admin",
    "Canonical Cooperative Admin role remains stable after refresh"
);

/* =========================================
   PHASE 6
   AUTHORIZED RE-ENTRY
   ========================================= */

assert(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin can re-enter Super Admin dashboard after refresh"
);

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin can re-enter Super Admin dashboard after refresh"
);

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin can re-enter Cooperative Admin dashboard after refresh"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin can re-enter Cooperative Admin dashboard after refresh"
);

/* =========================================
   PHASE 7
   CROSS-DASHBOARD RE-ENTRY PROTECTION
   ========================================= */

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot re-enter Super Admin dashboard after refresh"
);

assert(
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Legacy Cooperative Admin cannot re-enter Super Admin dashboard after refresh"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot re-enter Cooperative Admin dashboard after refresh"
);

assert(
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Legacy Super Admin cannot re-enter Cooperative Admin dashboard after refresh"
);

/* =========================================
   PHASE 8
   UNAUTHORIZED RE-ENTRY PROTECTION
   ========================================= */

assert(
    !rolesMatch("member", "super_admin"),
    "Member cannot re-enter Super Admin dashboard after refresh"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot re-enter Cooperative Admin dashboard after refresh"
);

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot re-enter Super Admin dashboard after refresh"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot re-enter Cooperative Admin dashboard after refresh"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role cannot re-enter Super Admin dashboard after refresh"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role cannot re-enter Cooperative Admin dashboard after refresh"
);

/* =========================================
   PHASE 9
   LOGIN FALLBACK
   ========================================= */

assert(
    superAdminSource.includes("login.html"),
    "Super Admin refresh guard retains login fallback"
);

assert(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin refresh guard retains login fallback"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC137 PROTECTED DASHBOARD REFRESH & RE-ENTRY TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC137 PROTECTED DASHBOARD REFRESH & RE-ENTRY TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC137 - PROTECTED DASHBOARD REFRESH & RE-ENTRY");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC137 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC137 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC137 PATCH COMPLETE");
    console.log("=========================================");
}

run();
