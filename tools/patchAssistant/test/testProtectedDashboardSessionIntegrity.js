/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC146 - PROTECTED DASHBOARD SESSION INTEGRITY TEST
 * =====================================================
 */

import fs from "fs";

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC146 - PROTECTED DASHBOARD SESSION INTEGRITY TEST");
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
   AUTHENTICATION SESSION BINDING
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin session remains bound to Firebase authentication state"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin session remains bound to Firebase authentication state"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin session resolves the current Firebase user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin session resolves the current Firebase user"
);

/* =========================================
   PHASE 2
   FIRESTORE PROFILE BINDING
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin session resolves the current Firestore user profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin session resolves the current Firestore user profile"
);

check(
    superAdminSource.includes("userDoc.exists()"),
    "Super Admin session validates the current authorization profile"
);

check(
    cooperativeAdminSource.includes("userDoc.exists()"),
    "Cooperative Admin session validates the current authorization profile"
);

/* =========================================
   PHASE 3
   CANONICAL ROLE INTEGRITY
   ========================================= */

check(
    roleSource.includes("normalizeRole"),
    "Session integrity uses canonical role normalization"
);

check(
    roleSource.includes("rolesMatch"),
    "Session integrity uses canonical role matching"
);

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin role remains canonically valid"
);

check(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin role remains valid"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin role remains canonically valid"
);

check(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin role remains valid"
);

/* =========================================
   PHASE 4
   CROSS-ROLE SESSION ISOLATION
   ========================================= */

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin session cannot satisfy Super Admin authorization"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin session cannot satisfy Cooperative Admin authorization"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member session cannot satisfy Super Admin authorization"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member session cannot satisfy Cooperative Admin authorization"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown session role cannot satisfy Super Admin authorization"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown session role cannot satisfy Cooperative Admin authorization"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing session role cannot satisfy Super Admin authorization"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing session role cannot satisfy Cooperative Admin authorization"
);

/* =========================================
   PHASE 5
   SESSION TERMINATION
   ========================================= */

check(
    superAdminSource.includes("signOut"),
    "Super Admin session supports Firebase session termination"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin session supports Firebase session termination"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin session retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin session retains login fallback"
);

/* =========================================
   PHASE 6
   HISTORY / RE-ENTRY SESSION INTEGRITY
   ========================================= */

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin session protects browser history and page re-entry"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin session protects browser history and page re-entry"
);

/* =========================================
   PHASE 7
   CROSS-DASHBOARD FALLBACK INTEGRITY
   ========================================= */

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin session retains Cooperative Admin fallback boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin session retains Super Admin fallback boundary"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC146 PROTECTED DASHBOARD SESSION INTEGRITY TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC146 PROTECTED DASHBOARD SESSION INTEGRITY TEST: PASS"
    );
}

console.log("=========================================");
