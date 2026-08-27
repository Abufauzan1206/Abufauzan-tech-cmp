import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardAuthorizationRevocation.js",
        search: `check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin dashboard can resolve the current authenticated user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin dashboard can resolve the current authenticated user"
);`,
        replace: `check(
    superAdminSource.includes("onAuthStateChanged(auth"),
    "Super Admin dashboard can resolve the current authenticated user through the Firebase auth-state boundary"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged(auth"),
    "Cooperative Admin dashboard can resolve the current authenticated user through the Firebase auth-state boundary"
);`
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC142 — AUTHORIZATION REVOCATION AUTH CONTRACT PATCH");
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
            ? "RC142 AUTH CONTRACT PATCH: PASS"
            : "RC142 AUTH CONTRACT PATCH: FAIL"
    );
} catch (error) {
    console.error("RC142 PATCH ERROR:", error.message);
    process.exitCode = 1;
}

console.log("===============================================");
