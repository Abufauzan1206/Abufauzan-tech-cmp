/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC132 - PROTECTED DASHBOARD SESSION PERSISTENCE TEST
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
console.log("RC132 - PROTECTED DASHBOARD SESSION PERSISTENCE TEST");
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
   SUPER ADMIN DASHBOARD SESSION CONTRACT
   ========================================= */

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

assert(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard monitors Firebase authentication state"
);

assert(
    superAdminSource.includes("auth"),
    "Super Admin dashboard uses the Firebase auth instance"
);

assert(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin dashboard retrieves profile using authenticated UID"
);

assert(
    superAdminSource.includes("getDoc"),
    "Super Admin dashboard retrieves the Firestore user profile"
);

assert(
    superAdminSource.includes("rolesMatch"),
    "Super Admin dashboard uses canonical role authorization"
);

assert(
    superAdminSource.includes('"super_admin"'),
    "Super Admin dashboard recognizes canonical super_admin role"
);

/* =========================================
   COOPERATIVE ADMIN DASHBOARD SESSION CONTRACT
   ========================================= */

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

assert(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard monitors Firebase authentication state"
);

assert(
    cooperativeAdminSource.includes("auth"),
    "Cooperative Admin dashboard uses the Firebase auth instance"
);

assert(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin dashboard retrieves profile using authenticated UID"
);

assert(
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin dashboard retrieves the Firestore user profile"
);

assert(
    cooperativeAdminSource.includes("rolesMatch"),
    "Cooperative Admin dashboard uses canonical role authorization"
);

assert(
    cooperativeAdminSource.includes('"cooperative_admin"'),
    "Cooperative Admin dashboard recognizes canonical cooperative_admin role"
);

/* =========================================
   ROLE NORMALIZATION
   ========================================= */

assert(
    normalizeRole("superAdmin") === "super_admin",
    "Legacy superAdmin survives session refresh normalization"
);

assert(
    normalizeRole("super_admin") === "super_admin",
    "Canonical super_admin survives session refresh normalization"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "Legacy cooperativeAdmin survives session refresh normalization"
);

assert(
    normalizeRole("cooperative_admin") === "cooperative_admin",
    "Canonical cooperative_admin survives session refresh normalization"
);

assert(
    normalizeRole("member") === "member",
    "Member role remains stable during session validation"
);

/* =========================================
   SUPER ADMIN SESSION BOUNDARY
   ========================================= */

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy superAdmin remains authorized for Super Admin dashboard"
);

assert(
    rolesMatch("super_admin", "super_admin"),
    "Canonical super_admin remains authorized for Super Admin dashboard"
);

assert(
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Cooperative Admin cannot enter Super Admin dashboard after refresh"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Canonical Cooperative Admin cannot enter Super Admin dashboard after refresh"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member cannot enter Super Admin dashboard after refresh"
);

/* =========================================
   COOPERATIVE ADMIN SESSION BOUNDARY
   ========================================= */

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy cooperativeAdmin remains authorized for Cooperative Admin dashboard"
);

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical cooperative_admin remains authorized for Cooperative Admin dashboard"
);

assert(
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Super Admin cannot enter Cooperative Admin dashboard after refresh"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Canonical Super Admin cannot enter Cooperative Admin dashboard after refresh"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot enter Cooperative Admin dashboard after refresh"
);

/* =========================================
   INVALID SESSION ROLES
   ========================================= */

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot bypass Super Admin session guard"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot bypass Cooperative Admin session guard"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role cannot bypass Super Admin session guard"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role cannot bypass Cooperative Admin session guard"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC132 PROTECTED DASHBOARD SESSION PERSISTENCE TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC132 PROTECTED DASHBOARD SESSION PERSISTENCE TEST: PASS"
    );
}

console.log("=========================================");
