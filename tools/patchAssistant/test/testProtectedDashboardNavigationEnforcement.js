/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC135 - PROTECTED DASHBOARD NAVIGATION ENFORCEMENT
 * INTEGRATION TEST
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
console.log("RC135 - PROTECTED DASHBOARD NAVIGATION ENFORCEMENT INTEGRATION TEST");
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
   SOURCE FILES
   ========================================= */

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

/* =========================================
   SUPER ADMIN AUTHENTICATION ENFORCEMENT
   ========================================= */

assert(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard monitors Firebase authentication state"
);

assert(
    superAdminSource.includes("auth"),
    "Super Admin dashboard uses Firebase authentication"
);

assert(
    superAdminSource.includes("user.uid"),
    "Super Admin dashboard uses authenticated Firebase UID"
);

assert(
    superAdminSource.includes("getDoc"),
    "Super Admin dashboard retrieves the Firestore user profile"
);

assert(
    superAdminSource.includes("login.html"),
    "Super Admin dashboard has a login redirect"
);

assert(
    superAdminSource.includes("signOut(auth)"),
    "Super Admin invalid sessions are explicitly terminated"
);

/* =========================================
   COOPERATIVE ADMIN AUTHENTICATION ENFORCEMENT
   ========================================= */

assert(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard monitors Firebase authentication state"
);

assert(
    cooperativeAdminSource.includes("auth"),
    "Cooperative Admin dashboard uses Firebase authentication"
);

assert(
    cooperativeAdminSource.includes("user.uid"),
    "Cooperative Admin dashboard uses authenticated Firebase UID"
);

assert(
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin dashboard retrieves the Firestore user profile"
);

assert(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin dashboard has a login redirect"
);

assert(
    cooperativeAdminSource.includes("signOut(auth)"),
    "Cooperative Admin invalid sessions are explicitly terminated"
);

/* =========================================
   SUPER ADMIN ROLE ENFORCEMENT
   ========================================= */

assert(
    superAdminSource.includes("rolesMatch"),
    "Super Admin dashboard uses canonical role authorization"
);

assert(
    superAdminSource.includes('"super_admin"'),
    "Super Admin dashboard checks canonical super_admin role"
);

assert(
    superAdminSource.includes('"cooperative_admin"'),
    "Super Admin dashboard recognizes Cooperative Admin redirection"
);

assert(
    superAdminSource.includes('"cooperative-admin.html"'),
    "Super Admin dashboard redirects Cooperative Admin users"
);

/* =========================================
   COOPERATIVE ADMIN ROLE ENFORCEMENT
   ========================================= */

assert(
    cooperativeAdminSource.includes("rolesMatch"),
    "Cooperative Admin dashboard uses canonical role authorization"
);

assert(
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin dashboard checks canonical cooperative_admin role"
);

assert(
    cooperativeAdminSource.includes('"super_admin"'),
    "Cooperative Admin dashboard recognizes Super Admin redirection"
);

assert(
    cooperativeAdminSource.includes('"super-admin.html"'),
    "Cooperative Admin dashboard redirects Super Admin users"
);

/* =========================================
   UNAUTHORIZED REDIRECT CONTRACT
   ========================================= */

assert(
    superAdminSource.includes("login.html"),
    "Super Admin unauthorized access ultimately has a login fallback"
);

assert(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin unauthorized access ultimately has a login fallback"
);

/* =========================================
   ROLE NORMALIZATION
   ========================================= */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "Legacy superAdmin normalizes to canonical super_admin"
);

assert(
    normalizeRole("super_admin") === "super_admin",
    "Canonical super_admin remains stable"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "Legacy cooperativeAdmin normalizes to canonical cooperative_admin"
);

assert(
    normalizeRole("cooperative_admin") === "cooperative_admin",
    "Canonical cooperative_admin remains stable"
);

/* =========================================
   SUPER ADMIN ACCESS MATRIX
   ========================================= */

assert(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin is authorized for Super Admin dashboard"
);

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin is authorized for Super Admin dashboard"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Canonical Cooperative Admin is rejected by Super Admin authorization"
);

assert(
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Legacy Cooperative Admin is rejected by Super Admin authorization"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member is rejected by Super Admin authorization"
);

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role is rejected by Super Admin authorization"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role is rejected by Super Admin authorization"
);

/* =========================================
   COOPERATIVE ADMIN ACCESS MATRIX
   ========================================= */

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin is authorized for Cooperative Admin dashboard"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin is authorized for Cooperative Admin dashboard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Canonical Super Admin is rejected by Cooperative Admin authorization"
);

assert(
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Legacy Super Admin is rejected by Cooperative Admin authorization"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member is rejected by Cooperative Admin authorization"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role is rejected by Cooperative Admin authorization"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role is rejected by Cooperative Admin authorization"
);

/* =========================================
   CROSS-DASHBOARD ISOLATION
   ========================================= */

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot cross the Super Admin boundary"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot cross the Cooperative Admin boundary"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC135 PROTECTED DASHBOARD NAVIGATION ENFORCEMENT INTEGRATION TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC135 PROTECTED DASHBOARD NAVIGATION ENFORCEMENT INTEGRATION TEST: PASS"
    );
}

console.log("=========================================");
