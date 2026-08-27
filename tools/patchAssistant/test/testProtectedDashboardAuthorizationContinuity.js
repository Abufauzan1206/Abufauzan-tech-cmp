/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC148 - PROTECTED DASHBOARD AUTHORIZATION CONTINUITY TEST
 * =====================================================
 */

import fs from "fs";

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC148 - PROTECTED DASHBOARD AUTHORIZATION CONTINUITY TEST");
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
   AUTHENTICATION CONTINUITY
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin continuously observes Firebase authentication"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin continuously observes Firebase authentication"
);

check(
    superAdminSource.includes("onAuthStateChanged(auth"),
    "Super Admin continuously resolves the current Firebase user through the Firebase auth-state boundary"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged(auth"),
    "Cooperative Admin continuously resolves the current Firebase user through the Firebase auth-state boundary"
);

/* =========================================
   PHASE 2
   FIRESTORE AUTHORIZATION CONTINUITY
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin continuously resolves the current Firestore profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin continuously resolves the current Firestore profile"
);

check(
    superAdminSource.includes("userDoc.exists()"),
    "Super Admin continuously validates Firestore profile existence"
);

check(
    cooperativeAdminSource.includes("userDoc.exists()"),
    "Cooperative Admin continuously validates Firestore profile existence"
);

/* =========================================
   PHASE 3
   ROLE CONTINUITY
   ========================================= */

check(
    roleSource.includes("normalizeRole"),
    "Authorization continuity exposes canonical role normalization"
);

check(
    roleSource.includes("rolesMatch"),
    "Authorization continuity exposes canonical role matching"
);

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin authorization remains continuous"
);

check(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin authorization remains continuous"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin authorization remains continuous"
);

check(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin authorization remains continuous"
);

/* =========================================
   PHASE 4
   AUTHORIZATION BOUNDARY CONTINUITY
   ========================================= */

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot cross the Super Admin boundary"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot cross the Cooperative Admin boundary"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member cannot cross the Super Admin boundary"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot cross the Cooperative Admin boundary"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot cross the Super Admin boundary"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot cross the Cooperative Admin boundary"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot cross the Super Admin boundary"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot cross the Cooperative Admin boundary"
);

/* =========================================
   PHASE 5
   SESSION TERMINATION CONTINUITY
   ========================================= */

check(
    superAdminSource.includes("signOut"),
    "Super Admin authorization supports session termination"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin authorization supports session termination"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin authorization retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin authorization retains login fallback"
);

/* =========================================
   PHASE 6
   HISTORY / RE-ENTRY CONTINUITY
   ========================================= */

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin authorization remains protected during browser re-entry"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin authorization remains protected during browser re-entry"
);

/* =========================================
   PHASE 7
   CROSS-DASHBOARD CONTINUITY
   ========================================= */

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin continuity boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains Super Admin continuity boundary"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC148 PROTECTED DASHBOARD AUTHORIZATION CONTINUITY TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC148 PROTECTED DASHBOARD AUTHORIZATION CONTINUITY TEST: PASS"
    );
}

console.log("=========================================");
