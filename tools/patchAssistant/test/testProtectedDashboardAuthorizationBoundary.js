/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC145 - PROTECTED DASHBOARD AUTHORIZATION BOUNDARY TEST
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
console.log("RC145 - PROTECTED DASHBOARD AUTHORIZATION BOUNDARY TEST");
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
   AUTHENTICATION BOUNDARY
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin continuously observes Firebase authentication state"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin continuously observes Firebase authentication state"
);

check(
    superAdminSource.includes("onAuthStateChanged(auth"),
    "Super Admin resolves the current authenticated Firebase user through the Firebase auth-state boundary"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged(auth"),
    "Cooperative Admin resolves the current authenticated Firebase user through the Firebase auth-state boundary"
);

/* =========================================
   PHASE 2
   FIRESTORE AUTHORIZATION BOUNDARY
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin authorization is bound to the current Firestore user profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin authorization is bound to the current Firestore user profile"
);

check(
    superAdminSource.includes("getDoc"),
    "Super Admin reloads the current Firestore authorization profile"
);

check(
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin reloads the current Firestore authorization profile"
);

check(
    superAdminSource.includes("userDoc.exists()"),
    "Super Admin validates Firestore profile existence"
);

check(
    cooperativeAdminSource.includes("userDoc.exists()"),
    "Cooperative Admin validates Firestore profile existence"
);

/* =========================================
   PHASE 3
   CANONICAL ROLE BOUNDARY
   ========================================= */

check(
    roleSource.includes("normalizeRole"),
    "Authorization layer exposes canonical role normalization"
);

check(
    roleSource.includes("rolesMatch"),
    "Authorization layer exposes canonical role matching"
);

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin role remains canonically authorized"
);

check(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin role remains authorized"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin role remains canonically authorized"
);

check(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin role remains authorized"
);

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot cross the Super Admin authorization boundary"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot cross the Cooperative Admin authorization boundary"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member cannot cross the Super Admin authorization boundary"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot cross the Cooperative Admin authorization boundary"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot cross the Super Admin authorization boundary"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot cross the Cooperative Admin authorization boundary"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot cross the Super Admin authorization boundary"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot cross the Cooperative Admin authorization boundary"
);

/* =========================================
   PHASE 4
   CROSS-DASHBOARD REDIRECT BOUNDARY
   ========================================= */

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin redirect boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains Super Admin redirect boundary"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin retains login fallback"
);

/* =========================================
   PHASE 5
   SESSION TERMINATION BOUNDARY
   ========================================= */

check(
    superAdminSource.includes("signOut"),
    "Super Admin supports protected-session termination"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin supports protected-session termination"
);

/* =========================================
   PHASE 6
   HISTORY RE-ENTRY BOUNDARY
   ========================================= */

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin protects browser history and page re-entry"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin protects browser history and page re-entry"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC145 PROTECTED DASHBOARD AUTHORIZATION BOUNDARY TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC145 PROTECTED DASHBOARD AUTHORIZATION BOUNDARY TEST: PASS"
    );
}

console.log("=========================================");
