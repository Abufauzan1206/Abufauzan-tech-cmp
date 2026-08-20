/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC150 - PROTECTED DASHBOARD AUTHORIZATION HARDENING TEST
 * =====================================================
 */

import fs from "fs";

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

let failed = false;

function check(condition, message) {
    if (condition) {
        console.log("PASS: " + message);
    } else {
        console.log("FAIL: " + message);
        failed = true;
    }
}

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin observes Firebase authentication state"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin observes Firebase authentication state"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin resolves the current Firebase user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin resolves the current Firebase user"
);

check(
    superAdminSource.includes('doc(db, "users", user.uid)'),
    "Super Admin resolves the current Firestore profile"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)'),
    "Cooperative Admin resolves the current Firestore profile"
);

check(
    superAdminSource.includes("rolesMatch"),
    "Super Admin uses canonical role authorization"
);

check(
    cooperativeAdminSource.includes("rolesMatch"),
    "Cooperative Admin uses canonical role authorization"
);

check(
    roleSource.includes("normalizeRole"),
    "Authorization layer exposes canonical role normalization"
);

check(
    roleSource.includes("rolesMatch"),
    "Authorization layer exposes canonical role matching"
);

check(
    superAdminSource.includes("signOut"),
    "Super Admin can terminate unauthorized sessions"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin can terminate unauthorized sessions"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin retains login fallback"
);

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin retains Cooperative Admin boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin retains Super Admin boundary"
);

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin protects browser re-entry"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin protects browser re-entry"
);

console.log("=========================================");

if (failed) {
    console.log(
        "RC150 PROTECTED DASHBOARD AUTHORIZATION HARDENING TEST: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC150 PROTECTED DASHBOARD AUTHORIZATION HARDENING TEST: PASS"
    );
}

console.log("=========================================");
