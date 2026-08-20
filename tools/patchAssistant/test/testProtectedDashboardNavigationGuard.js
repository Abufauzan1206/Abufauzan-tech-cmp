/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC134 - PROTECTED DASHBOARD NAVIGATION GUARD TEST
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
console.log("RC134 - PROTECTED DASHBOARD NAVIGATION GUARD TEST");
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
   SOURCE FILE CONTRACT
   ========================================= */

const sidebarSource = fs.readFileSync(
    "js/navigation/sidebar.js",
    "utf8"
);

const menuSource = fs.readFileSync(
    "js/navigation/menu-data.js",
    "utf8"
);

/* =========================================
   ROLE AUTHORIZATION CONTRACT
   ========================================= */

assert(
    typeof normalizeRole === "function",
    "Navigation guard has access to canonical role normalization"
);

assert(
    typeof rolesMatch === "function",
    "Navigation guard has access to canonical role matching"
);

assert(
    normalizeRole("superAdmin") === "super_admin",
    "Legacy superAdmin normalizes to canonical super_admin"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "Legacy cooperativeAdmin normalizes to canonical cooperative_admin"
);

/* =========================================
   ROLE ISOLATION
   ========================================= */

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Super Admin legacy role matches Super Admin authorization"
);

assert(
    rolesMatch("super_admin", "super_admin"),
    "Super Admin canonical role matches Super Admin authorization"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Cooperative Admin legacy role matches Cooperative Admin authorization"
);

assert(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Cooperative Admin canonical role matches Cooperative Admin authorization"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot satisfy Super Admin navigation authorization"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot satisfy Cooperative Admin navigation authorization"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member cannot satisfy Super Admin navigation authorization"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot satisfy Cooperative Admin navigation authorization"
);

assert(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot satisfy Super Admin navigation authorization"
);

assert(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot satisfy Cooperative Admin navigation authorization"
);

assert(
    !rolesMatch(null, "super_admin"),
    "Missing role cannot satisfy Super Admin navigation authorization"
);

assert(
    !rolesMatch(null, "cooperative_admin"),
    "Missing role cannot satisfy Cooperative Admin navigation authorization"
);

/* =========================================
   NAVIGATION SOURCE CONTRACT
   ========================================= */

assert(
    sidebarSource.length > 0,
    "Sidebar navigation source exists and is readable"
);

assert(
    menuSource.length > 0,
    "Menu data source exists and is readable"
);

assert(
    sidebarSource.includes("super-admin.html") ||
    menuSource.includes("super-admin.html"),
    "Navigation configuration contains the Super Admin dashboard destination"
);

assert(
    !menuSource.includes("cooperative-admin.html") &&
    !sidebarSource.includes("cooperative-admin.html"),
    "Shared navigation does not expose a Cooperative Admin dashboard destination"
);

/* =========================================
   DESTINATION SECURITY CONTRACT
   ========================================= */

const superAdminSource = fs.readFileSync(
    "js/super-admin.js",
    "utf8"
);

const cooperativeAdminSource = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

assert(
    superAdminSource.includes("rolesMatch") &&
    superAdminSource.includes("super_admin"),
    "Super Admin destination remains protected by canonical role authorization"
);

assert(
    cooperativeAdminSource.includes("rolesMatch") &&
    cooperativeAdminSource.includes("cooperative_admin"),
    "Cooperative Admin destination remains protected by canonical role authorization"
);

assert(
    superAdminSource.includes("login.html"),
    "Super Admin unauthorized navigation ultimately has a login redirect"
);

assert(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin unauthorized navigation ultimately has a login redirect"
);

/* =========================================
   CROSS-DASHBOARD BOUNDARY
   ========================================= */

assert(
    rolesMatch("superAdmin", "super_admin") &&
    !rolesMatch("superAdmin", "cooperative_admin"),
    "Super Admin navigation boundary remains isolated"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin") &&
    !rolesMatch("cooperativeAdmin", "super_admin"),
    "Cooperative Admin navigation boundary remains isolated"
);

/* =========================================
   FINAL RESULT
   ========================================= */

console.log("=========================================");

if (failed) {
    console.log(
        "RC134 PROTECTED DASHBOARD NAVIGATION GUARD TEST: FAIL"
    );

    process.exitCode = 1;
} else {
    console.log(
        "RC134 PROTECTED DASHBOARD NAVIGATION GUARD TEST: PASS"
    );
}

console.log("=========================================");
