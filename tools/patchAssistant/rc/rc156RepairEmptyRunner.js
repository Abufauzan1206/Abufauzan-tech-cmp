import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc156ProtectedDashboardAuthorizationRegressionVerification.js",
        mode: "regex",
        search: "^$",
        replace: `import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardAuthorizationRegressionVerification.js",
        mode: "create",
        search: "unused",
        replace: \`import fs from "fs";

const superAdminSource = fs.readFileSync("js/super-admin.js", "utf8");
const cooperativeAdminSource = fs.readFileSync("js/cooperative-admin.js", "utf8");
const roleSource = fs.readFileSync("js/components/roleAuthorization.js", "utf8");

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
    superAdminSource.includes("onAuthStateChanged") &&
    cooperativeAdminSource.includes("onAuthStateChanged"),
    "Authentication guards remain active on both protected dashboards"
);

check(
    superAdminSource.includes("auth.currentUser") &&
    cooperativeAdminSource.includes("auth.currentUser"),
    "Both dashboards remain bound to the active Firebase user"
);

check(
    superAdminSource.includes("rolesMatch") &&
    cooperativeAdminSource.includes("rolesMatch"),
    "Canonical role authorization remains intact"
);

check(
    roleSource.includes("normalizeRole") &&
    roleSource.includes("rolesMatch"),
    "Canonical authorization primitives remain intact"
);

check(
    superAdminSource.includes("signOut") &&
    cooperativeAdminSource.includes("signOut"),
    "Protected session termination remains available"
);

check(
    superAdminSource.includes("login.html") &&
    cooperativeAdminSource.includes("login.html"),
    "Login fallback remains available"
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
    "Super Admin retains browser re-entry protection"
);

check(
    cooperativeAdminSource.includes("popstate") &&
    cooperativeAdminSource.includes("pageshow") &&
    cooperativeAdminSource.includes("visibilitychange"),
    "Cooperative Admin retains browser re-entry protection"
);

console.log("=========================================");

if (failed) {
    console.log("RC156 PROTECTED DASHBOARD AUTHORIZATION REGRESSION VERIFICATION TEST: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC156 PROTECTED DASHBOARD AUTHORIZATION REGRESSION VERIFICATION TEST: PASS");
}

console.log("=========================================");
\`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC156 - PROTECTED DASHBOARD AUTHORIZATION REGRESSION VERIFICATION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC156 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC156 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC156 PATCH COMPLETE");
    console.log("=========================================");
    console.log("Running RC156 test...");
    console.log("=========================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        ["tools/patchAssistant/test/testProtectedDashboardAuthorizationRegressionVerification.js"],
        { stdio: "inherit" }
    );

    process.exitCode = test.status ?? 1;
}

run();
`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC156 REPAIR - EMPTY RUNNER");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC156 REPAIR TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC156 REPAIR FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC156 REPAIR COMPLETE");
    console.log("=========================================");
}
run();
