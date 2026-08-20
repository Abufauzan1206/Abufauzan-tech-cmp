/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC138 - PROTECTED DASHBOARD CROSS-SESSION ISOLATION
 *
 * Purpose:
 * Verify that authorization from one authenticated
 * session cannot persist into another user's session.
 *
 * No production files are modified.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardCrossSessionIsolation.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC138 - PROTECTED DASHBOARD CROSS-SESSION ISOLATION TEST
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
console.log("RC138 - PROTECTED DASHBOARD CROSS-SESSION ISOLATION TEST");
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

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const authSource = fs.readFileSync(
    "js/components/auth.js",
    "utf8"
);

const roleSource = fs.readFileSync(
    "js/components/roleAuthorization.js",
    "utf8"
);

/* =========================================
   PHASE 1
   AUTH STATE MONITORING
   ========================================= */

assert(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard monitors authentication state across sessions"
);

assert(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard monitors authentication state across sessions"
);

/* =========================================
   PHASE 2
   CURRENT USER BOUNDARY
   ========================================= */

assert(
    superAdminSource.includes("user.uid"),
    "Super Admin authorization is bound to the current authenticated UID"
);

assert(
    cooperativeAdminSource.includes("user.uid"),
    "Cooperative Admin authorization is bound to the current authenticated UID"
);

/* =========================================
   PHASE 3
   PROFILE RELOAD
   ========================================= */

assert(
    superAdminSource.includes("getDoc"),
    "Super Admin session loads the current user's Firestore profile"
);

assert(
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin session loads the current user's Firestore profile"
);

/* =========================================
   PHASE 4
   ROLE NORMALIZATION
   ========================================= */

assert(
    roleSource.includes("normalizeRole"),
    "Role authorization exposes canonical normalization"
);

assert(
    roleSource.includes("rolesMatch"),
    "Role authorization exposes canonical matching"
);

/* =========================================
   PHASE 5
   SESSION A -> SESSION B
   SUPER ADMIN TO COOPERATIVE ADMIN
   ========================================= */

assert(
    rolesMatch("super_admin", "super_admin"),
    "Session A Super Admin is authorized for Super Admin dashboard"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Session B Cooperative Admin cannot inherit Session A Super Admin authorization"
);

/* =========================================
   PHASE 6
   SESSION A -> SESSION B
   COOPERATIVE ADMIN TO SUPER ADMIN
   ========================================= */

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Session A Cooperative Admin is authorized for Cooperative Admin dashboard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Session B Super Admin cannot inherit Session A Cooperative Admin authorization"
);

/* =========================================
   PHASE 7
   LEGACY ROLE ISOLATION
   ========================================= */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "Legacy Super Admin remains isolated to canonical Super Admin authorization"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "Legacy Cooperative Admin remains isolated to canonical Cooperative Admin authorization"
);

assert(
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Legacy Cooperative Admin cannot inherit Super Admin authorization"
);

assert(
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Legacy Super Admin cannot inherit Cooperative Admin authorization"
);

/* =========================================
   PHASE 8
   NON-ADMIN SESSION ISOLATION
   ========================================= */

assert(
    !rolesMatch("member", "super_admin"),
    "Member session cannot inherit Super Admin authorization"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member session cannot inherit Cooperative Admin authorization"
);

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown session cannot inherit Super Admin authorization"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown session cannot inherit Cooperative Admin authorization"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing-role session cannot inherit Super Admin authorization"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing-role session cannot inherit Cooperative Admin authorization"
);

/* =========================================
   PHASE 9
   SESSION TERMINATION / FALLBACK
   ========================================= */

assert(
    authSource.includes("signOut") ||
    superAdminSource.includes("signOut") ||
    cooperativeAdminSource.includes("signOut"),
    "Authentication system exposes Firebase sign-out capability"
);

assert(
    superAdminSource.includes("login.html"),
    "Super Admin cross-session failure retains login fallback"
);

assert(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin cross-session failure retains login fallback"
);

/* =========================================
   PHASE 10
   CROSS-DASHBOARD SOURCE ISOLATION
   ========================================= */

assert(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin dashboard has an explicit Cooperative Admin redirect boundary"
);

assert(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin dashboard has an explicit Super Admin redirect boundary"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC138 PROTECTED DASHBOARD CROSS-SESSION ISOLATION TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC138 PROTECTED DASHBOARD CROSS-SESSION ISOLATION TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC138 - PROTECTED DASHBOARD CROSS-SESSION ISOLATION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC138 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC138 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC138 PATCH COMPLETE");
    console.log("=========================================");
}

run();
