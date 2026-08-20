/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC130 - LOGIN ROUTING INTEGRATION TEST
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
console.log("RC130 - LOGIN ROUTING INTEGRATION TEST");
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
   AUTH.JS CONTRACT
   ========================================= */

const authSource = fs.readFileSync(
    "js/auth.js",
    "utf8"
);

assert(
    authSource.includes('signInWithEmailAndPassword'),
    "auth.js uses Firebase email/password authentication"
);

assert(
    authSource.includes('getDoc'),
    "auth.js retrieves the Firestore user profile"
);

assert(
    authSource.includes('doc(db, "users", uid)'),
    "auth.js reads the authenticated user's Firestore profile"
);

assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"super_admin"'),
    "auth.js uses canonical Super Admin role authorization"
);

assert(
    authSource.includes('rolesMatch') &&
    authSource.includes('"cooperative_admin"'),
    "auth.js uses canonical Cooperative Admin role authorization"
);

assert(
    authSource.includes('"super-admin.html"'),
    "auth.js routes Super Admin to super-admin.html"
);

assert(
    authSource.includes('"cooperative-admin.html"'),
    "auth.js routes Cooperative Admin to cooperative-admin.html"
);

/* =========================================
   SUPER ADMIN ROUTING
   ========================================= */

assert(
    rolesMatch("superAdmin", "super_admin"),
    "legacy superAdmin routes as Super Admin"
);

assert(
    rolesMatch("super_admin", "super_admin"),
    "canonical super_admin routes as Super Admin"
);

assert(
    normalizeRole("superAdmin") === "super_admin",
    "superAdmin normalizes to canonical Super Admin role"
);

/* =========================================
   COOPERATIVE ADMIN ROUTING
   ========================================= */

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "legacy cooperativeAdmin routes as Cooperative Admin"
);

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "canonical cooperative_admin routes as Cooperative Admin"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "cooperativeAdmin normalizes to canonical Cooperative Admin role"
);

/* =========================================
   ROUTING ISOLATION
   ========================================= */

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot satisfy Super Admin route"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot satisfy Cooperative Admin route"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member cannot satisfy Super Admin route"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot satisfy Cooperative Admin route"
);

/* =========================================
   UNSUPPORTED ROLES
   ========================================= */

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot satisfy Super Admin route"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot satisfy Cooperative Admin route"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role cannot satisfy Super Admin route"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role cannot satisfy Cooperative Admin route"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {

    console.log(
        "RC130 LOGIN ROUTING INTEGRATION TEST: FAIL"
    );

    process.exitCode = 1;

} else {

    console.log(
        "RC130 LOGIN ROUTING INTEGRATION TEST: PASS"
    );

}

console.log("=========================================");
