/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC149 - PROTECTED DASHBOARD AUTHORIZATION PERSISTENCE
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardAuthorizationPersistence.js",
        mode: "text",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC149 - PROTECTED DASHBOARD AUTHORIZATION PERSISTENCE TEST
 * =====================================================
 */

import fs from "fs";

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC149 - PROTECTED DASHBOARD AUTHORIZATION PERSISTENCE TEST");
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

check(
    superAdminSource.includes("onAuthStateChanged"),
    "Super Admin authorization persists through Firebase authentication observation"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Cooperative Admin authorization persists through Firebase authentication observation"
);

check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin authorization persists through current Firebase user resolution"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin authorization persists through current Firebase user resolution"
);

check(
    superAdminSource.includes('doc(db, "users", user.uid)') &&
    superAdminSource.includes("getDoc"),
    "Super Admin authorization persists through Firestore profile validation"
);

check(
    cooperativeAdminSource.includes('doc(db, "users", user.uid)') &&
    cooperativeAdminSource.includes("getDoc"),
    "Cooperative Admin authorization persists through Firestore profile validation"
);

check(
    roleSource.includes("normalizeRole"),
    "Authorization persistence exposes canonical role normalization"
);

check(
    roleSource.includes("rolesMatch"),
    "Authorization persistence exposes canonical role matching"
);

check(
    rolesMatch("superAdmin", "super_admin"),
    "Legacy Super Admin role remains persistently canonical"
);

check(
    rolesMatch("super_admin", "super_admin"),
    "Canonical Super Admin role remains persistently authorized"
);

check(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Legacy Cooperative Admin role remains persistently canonical"
);

check(
    rolesMatch("cooperative_admin", "cooperative_admin"),
    "Canonical Cooperative Admin role remains persistently authorized"
);

check(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot persist Super Admin authorization"
);

check(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot persist Cooperative Admin authorization"
);

check(
    !rolesMatch("member", "super_admin"),
    "Member cannot persist Super Admin authorization"
);

check(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot persist Cooperative Admin authorization"
);

check(
    !rolesMatch("unknown", "super_admin"),
    "Unknown role cannot persist Super Admin authorization"
);

check(
    !rolesMatch("unknown", "cooperative_admin"),
    "Unknown role cannot persist Cooperative Admin authorization"
);

check(
    !rolesMatch(undefined, "super_admin"),
    "Missing role cannot persist Super Admin authorization"
);

check(
    !rolesMatch(undefined, "cooperative_admin"),
    "Missing role cannot persist Cooperative Admin authorization"
);

check(
    superAdminSource.includes("signOut"),
    "Super Admin persistence failure can terminate the protected session"
);

check(
    cooperativeAdminSource.includes("signOut"),
    "Cooperative Admin persistence failure can terminate the protected session"
);

check(
    superAdminSource.includes("login.html"),
    "Super Admin persistence failure retains login fallback"
);

check(
    cooperativeAdminSource.includes("login.html"),
    "Cooperative Admin persistence failure retains login fallback"
);

check(
    superAdminSource.includes("cooperative-admin.html"),
    "Super Admin persistence retains Cooperative Admin boundary"
);

check(
    cooperativeAdminSource.includes("super-admin.html"),
    "Cooperative Admin persistence retains Super Admin boundary"
);

check(
    superAdminSource.includes("popstate") &&
    superAdminSource.includes("pageshow") &&
    superAdminSource.includes("visibilitychange"),
    "Super Admin authorization persists across browser re-entry"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin authorization persists across browser re-entry"
);

console.log("=========================================");

if (failed) {
    console.log(
        "RC149 PROTECTED DASHBOARD AUTHORIZATION PERSISTENCE TEST: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC149 PROTECTED DASHBOARD AUTHORIZATION PERSISTENCE TEST: PASS"
    );
}

console.log("=========================================");
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC149 - PROTECTED DASHBOARD AUTHORIZATION PERSISTENCE");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC149 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC149 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC149 PATCH COMPLETE");
    console.log("=========================================");

    console.log("Running RC149 test...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testProtectedDashboardAuthorizationPersistence.js"
        ],
        {
            stdio: "inherit"
        }
    );

    process.exitCode = test.status ?? 1;
}

run();
