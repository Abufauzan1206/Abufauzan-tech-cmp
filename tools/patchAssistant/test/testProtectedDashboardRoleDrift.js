import fs from "fs";
import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC143 - PROTECTED DASHBOARD ROLE DRIFT TEST");
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
   CURRENT AUTHENTICATION STATE
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard observes authentication state during role drift"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard observes authentication state during role drift"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin dashboard resolves the current authenticated user during role drift"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin dashboard resolves the current authenticated user during role drift"
);

/* =========================================
   PHASE 2
   FIRESTORE PROFILE REVALIDATION
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin dashboard reloads the current Firestore authorization profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin dashboard reloads the current Firestore authorization profile"
);

check(
    superAdminSource.includes("userDoc.data()"),
    "Super Admin dashboard reads the current Firestore role"
);

check(
    cooperativeAdminSource.includes("userDoc.data()"),
    "Cooperative Admin dashboard reads the current Firestore role"
);

/* =========================================
   PHASE 3
   CANONICAL ROLE ENFORCEMENT
   ========================================= */

check(
    roleSource.includes("normalizeRole"),
    "Role drift protection uses canonical role normalization"
);

check(
    roleSource.includes("rolesMatch"),
    "Role drift protection uses canonical role matching"
);

check(
    roleSource.includes('"super_admin"'),
    "Role drift protection recognizes canonical Super Admin authorization"
);

check(
    roleSource.includes('"cooperative_admin"'),
    "Role drift protection recognizes canonical Cooperative Admin authorization"
);

/* =========================================
   PHASE 4
   ROLE DRIFT NEGATIVE CONTRACT
   ========================================= */

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin role remains valid"
);

check(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin role remains valid"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin role remains valid"
);

check(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin role remains valid"
);

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot retain Super Admin authorization after role drift"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot retain Cooperative Admin authorization after role drift"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member cannot retain Super Admin authorization after role drift"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot retain Cooperative Admin authorization after role drift"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot retain Super Admin authorization after role drift"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot retain Cooperative Admin authorization after role drift"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot retain Super Admin authorization after role drift"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot retain Cooperative Admin authorization after role drift"
);

/* =========================================
   PHASE 5
   CROSS-DASHBOARD ROLE DRIFT BOUNDARY
   ========================================= */

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin role drift retains Cooperative Admin redirect boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin role drift retains Super Admin redirect boundary"
);

/* =========================================
   PHASE 6
   SESSION TERMINATION FALLBACK
   ========================================= */

check(
    superAdminSource.includes("signOut"),
    "Super Admin role drift can terminate the stale session"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin role drift can terminate the stale session"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin role drift retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin role drift retains login fallback"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC143 PROTECTED DASHBOARD ROLE DRIFT TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC143 PROTECTED DASHBOARD ROLE DRIFT TEST: PASS"
    );
}

console.log("=========================================");
