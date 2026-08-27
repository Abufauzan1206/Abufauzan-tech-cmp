import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardSessionIsolation.js",
        search: `check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin resolves the active Firebase session user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin resolves the active Firebase session user"
);`,
        replace: `check(
    superAdminSource.includes("onAuthStateChanged(auth"),
    "Super Admin resolves the active Firebase session user through the Firebase auth-state boundary"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged(auth"),
    "Cooperative Admin resolves the active Firebase session user through the Firebase auth-state boundary"
);`
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC147 — PROTECTED DASHBOARD SESSION ISOLATION CONTRACT PATCH");
console.log("===============================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

try {
    const result = await transaction(patches);

    console.log("PATCH ENGINE RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
    }

    console.log("");
    console.log(
        result.success
            ? "RC147 PROTECTED DASHBOARD SESSION ISOLATION CONTRACT PATCH: PASS"
            : "RC147 PROTECTED DASHBOARD SESSION ISOLATION CONTRACT PATCH: FAIL"
    );
} catch (error) {
    console.error("RC147 PATCH ERROR:", error.message);
    process.exitCode = 1;
}

console.log("===============================================");
