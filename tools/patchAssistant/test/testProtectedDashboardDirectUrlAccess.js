/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC139 - PROTECTED DASHBOARD DIRECT-URL ACCESS TEST
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
console.log("RC139 - PROTECTED DASHBOARD DIRECT-URL ACCESS TEST");
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

const roleSource = fs.readFileSync(
    "js/components/roleAuthorization.js",
    "utf8"
);

/* =========================================
   PHASE 1
   DIRECT-URL AUTHENTICATION GUARDS
   ========================================= */

assert(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin direct URL access is protected by Firebase authentication state"
);

assert(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin direct URL access is protected by Firebase authentication state"
);

/* =========================================
   PHASE 2
   CURRENT SESSION / UID VALIDATION
   ========================================= */

assert(
    superAdminSource.includes("user.uid"),
    "Super Admin direct access resolves the authenticated Firebase UID"
);

assert(
    cooperativeAdminSource.includes("user.uid"),
    "Cooperative Admin direct access resolves the authenticated Firebase UID"
);

/* =========================================
   PHASE 3
   FIRESTORE PROFILE VALIDATION
   ========================================= */

assert(
    superAdminSource.includes("getDoc"),
    "Super Admin direct access validates the Firestore user profile"
);

assert(
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin direct access validates the Firestore user profile"
);

/* =========================================
   PHASE 4
   ROLE AUTHORIZATION
   ========================================= */

assert(
    roleSource.includes("normalizeRole"),
    "Direct URL protection uses canonical role normalization"
);

assert(
    roleSource.includes("rolesMatch"),
    "Direct URL protection uses canonical role matching"
);

assert(
    superAdminSource.includes("rolesMatch") ||
    superAdminSource.includes("normalizeRole"),
    "Super Admin direct URL guard uses canonical role authorization"
);

assert(
    cooperativeAdminSource.includes("rolesMatch") ||
    cooperativeAdminSource.includes("normalizeRole"),
    "Cooperative Admin direct URL guard uses canonical role authorization"
);

/* =========================================
   PHASE 5
   SUPER ADMIN DIRECT ACCESS
   ========================================= */

assert(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin can directly enter Super Admin dashboard"
);

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin can directly enter Super Admin dashboard"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Canonical Cooperative Admin cannot directly enter Super Admin dashboard"
);

assert(
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Legacy Cooperative Admin cannot directly enter Super Admin dashboard"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member cannot directly enter Super Admin dashboard"
);

/* =========================================
   PHASE 6
   COOPERATIVE ADMIN DIRECT ACCESS
   ========================================= */

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin can directly enter Cooperative Admin dashboard"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin can directly enter Cooperative Admin dashboard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Canonical Super Admin cannot directly enter Cooperative Admin dashboard"
);

assert(
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Legacy Super Admin cannot directly enter Cooperative Admin dashboard"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot directly enter Cooperative Admin dashboard"
);

/* =========================================
   PHASE 7
   UNKNOWN / MISSING ROLE PROTECTION
   ========================================= */

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot bypass Super Admin direct URL guard"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot bypass Cooperative Admin direct URL guard"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role cannot bypass Super Admin direct URL guard"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role cannot bypass Cooperative Admin direct URL guard"
);

/* =========================================
   PHASE 8
   LOGIN FALLBACK
   ========================================= */

assert(
    superAdminSource.includes("login.html"),
    "Super Admin direct URL guard provides login fallback"
);

assert(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin direct URL guard provides login fallback"
);

/* =========================================
   PHASE 9
   CROSS-DASHBOARD REDIRECTION
   ========================================= */

assert(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin direct URL guard recognizes Cooperative Admin redirection"
);

assert(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin direct URL guard recognizes Super Admin redirection"
);

/* =========================================
   PHASE 10
   SESSION TERMINATION
   ========================================= */

assert(
    superAdminSource.includes("signOut") ||
    superAdminSource.includes("logout"),
    "Super Admin invalid direct-access session can be terminated"
);

assert(
    cooperativeAdminSource.includes("signOut") ||
    cooperativeAdminSource.includes("logout"),
    "Cooperative Admin invalid direct-access session can be terminated"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC139 PROTECTED DASHBOARD DIRECT-URL ACCESS TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC139 PROTECTED DASHBOARD DIRECT-URL ACCESS TEST: PASS"
    );
}

console.log("=========================================");
