import fs from "fs";

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

const roleAuthorizationSource = fs.readFileSync(
    "js/components/roleAuthorization.js",
    "utf8"
);

let failed = false;

function check(condition, message) {
    if (condition) {
        console.log("PASS:", message);
    } else {
        console.log("FAIL:", message);
        failed = true;
    }
}

/* =========================================
   PHASE 1
   AUTHENTICATION OBSERVATION
   ========================================= */

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin dashboard observes authentication changes"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin dashboard observes authentication changes"
);

/* =========================================
   PHASE 2
   CURRENT USER RESOLUTION
   ========================================= */

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin dashboard resolves the current Firebase user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin dashboard resolves the current Firebase user"
);

/* =========================================
   PHASE 3
   FIRESTORE PROFILE REVALIDATION
   ========================================= */

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin dashboard resolves the current Firestore profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin dashboard resolves the current Firestore profile"
);

check(
    superAdminSource.includes("userDoc.data()"),
    "Super Admin dashboard reloads authorization data"
);

check(
    cooperativeAdminSource.includes("userDoc.data()"),
    "Cooperative Admin dashboard reloads authorization data"
);

/* =========================================
   PHASE 4
   CANONICAL ROLE VALIDATION
   ========================================= */

check(
    roleAuthorizationSource.includes("normalizeRole"),
    "Authorization drift protection uses canonical role normalization"
);

check(
    roleAuthorizationSource.includes("rolesMatch"),
    "Authorization drift protection uses canonical role matching"
);

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin role remains canonical"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin role remains canonical"
);

/* =========================================
   PHASE 5
   ROLE DRIFT NEGATIVE CONTRACT
   ========================================= */

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
    "Unknown role cannot bypass authorization drift protection"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot bypass authorization drift protection"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot bypass authorization drift protection"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot bypass authorization drift protection"
);

/* =========================================
   PHASE 6
   LOGIN FALLBACK
   ========================================= */

check(
    superAdminSource.includes("login.html"),
    "Super Admin authorization drift retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin authorization drift retains login fallback"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC143 PROTECTED DASHBOARD AUTHORIZATION DRIFT TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC143 PROTECTED DASHBOARD AUTHORIZATION DRIFT TEST: PASS"
    );
}

console.log("=========================================");
