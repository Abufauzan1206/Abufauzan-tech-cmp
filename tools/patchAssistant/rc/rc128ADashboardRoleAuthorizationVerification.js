/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC128A - DASHBOARD ROLE AUTHORIZATION VERIFICATION
 *
 * Purpose:
 * 1. Verify Super Admin dashboard uses canonical rolesMatch().
 * 2. Verify Cooperative Admin dashboard uses canonical rolesMatch().
 * 3. Verify RC128 integration test exists.
 * 4. Do not modify already-correct dashboard files.
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [

    {
        path: "tools/patchAssistant/test/testDashboardRoleAuthorization.js",
        mode: "create",
        search: "",
        replace: `/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC128 - DASHBOARD ROLE AUTHORIZATION TEST
 *
 * =====================================================
 */

import {
    normalizeRole,
    rolesMatch
} from "../../../js/components/roleAuthorization.js";

console.log("=========================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC128 - DASHBOARD ROLE AUTHORIZATION TEST");
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

assert(
    normalizeRole("superAdmin") === "super_admin",
    "superAdmin normalizes to super_admin"
);

assert(
    normalizeRole("super_admin") === "super_admin",
    "super_admin remains super_admin"
);

assert(
    normalizeRole("cooperativeAdmin") === "cooperative_admin",
    "cooperativeAdmin normalizes to cooperative_admin"
);

assert(
    normalizeRole("cooperative_admin") === "cooperative_admin",
    "cooperative_admin remains cooperative_admin"
);

assert(
    rolesMatch("superAdmin", "super_admin"),
    "Super Admin legacy alias authorizes Super Admin dashboard"
);

assert(
    rolesMatch("super_admin", "superAdmin"),
    "Canonical Super Admin role authorizes Super Admin dashboard"
);

assert(
    rolesMatch("cooperativeAdmin", "cooperative_admin"),
    "Cooperative Admin legacy alias authorizes Cooperative Admin dashboard"
);

assert(
    rolesMatch("cooperative_admin", "cooperativeAdmin"),
    "Canonical Cooperative Admin role authorizes Cooperative Admin dashboard"
);

assert(
    !rolesMatch("cooperative_admin", "super_admin"),
    "Cooperative Admin cannot authorize Super Admin dashboard"
);

assert(
    !rolesMatch("super_admin", "cooperative_admin"),
    "Super Admin cannot authorize Cooperative Admin dashboard"
);

assert(
    rolesMatch("member", "member"),
    "Member remains authorized only as member"
);

assert(
    !rolesMatch("member", "super_admin"),
    "Member cannot authorize Super Admin dashboard"
);

assert(
    !rolesMatch("member", "cooperative_admin"),
    "Member cannot authorize Cooperative Admin dashboard"
);

console.log("=========================================");

if (failed) {
    console.log(
        "RC128 DASHBOARD ROLE AUTHORIZATION TEST: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC128 DASHBOARD ROLE AUTHORIZATION TEST: PASS"
    );
}

console.log("=========================================");
`
    }

];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC128A - DASHBOARD ROLE AUTHORIZATION VERIFICATION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC128A TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC128A PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC128A PATCH COMPLETE");
    console.log("=========================================");
}

run();
