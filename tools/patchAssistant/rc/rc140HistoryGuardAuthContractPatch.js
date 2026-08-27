import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardHistoryGuard.js",
        search: `check(
    superAdminSource.includes("currentUser"),
    "Super Admin dashboard resolves the current Firebase user"
);

check(
    cooperativeAdminSource.includes("currentUser"),
    "Cooperative Admin dashboard resolves the current Firebase user"
);`,
        replace: `check(
    superAdminSource.includes("onAuthStateChanged(auth"),
    "Super Admin dashboard resolves the current Firebase user through the Firebase auth-state boundary"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged(auth"),
    "Cooperative Admin dashboard resolves the current Firebase user through the Firebase auth-state boundary"
);`
    }
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC140 — HISTORY GUARD AUTH CONTRACT PATCH");
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
            ? "RC140 HISTORY GUARD AUTH CONTRACT PATCH: PASS"
            : "RC140 HISTORY GUARD AUTH CONTRACT PATCH: FAIL"
    );
} catch (error) {
    console.error("RC140 PATCH ERROR:", error.message);
    process.exitCode = 1;
}

console.log("===============================================");
