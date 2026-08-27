import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testProtectedDashboardSessionIntegrity.js",
        mode: "text",
        search: `check(
    superAdminSource.includes("auth.currentUser"),
    "Super Admin session resolves the current Firebase user"
);

check(
    cooperativeAdminSource.includes("auth.currentUser"),
    "Cooperative Admin session resolves the current Firebase user"
);`,
        replace: `check(
    superAdminSource.includes("onAuthStateChanged(auth"),
    "Super Admin session resolves the current Firebase user through the Firebase auth-state boundary"
);

check(
    cooperativeAdminSource.includes("onAuthStateChanged(auth"),
    "Cooperative Admin session resolves the current Firebase user through the Firebase auth-state boundary"
);

check(
    !superAdminSource.includes("if (!currentUser)"),
    "Super Admin dashboard has no premature auth.currentUser initialization gate"
);

check(
    !cooperativeAdminSource.includes("if (!currentUser)"),
    "Cooperative Admin dashboard has no premature auth.currentUser initialization gate"
);`
    }
];

async function run() {
    console.log("================================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC297D-E14 — RC146 SESSION TEST CONTRACT REPAIR");
    console.log("================================================");

    const result = await transaction(patches);

    console.log("RC297D-E14 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("================================================");
        console.log("RC297D-E14 PATCH FAIL");
        console.log("================================================");
        return;
    }

    console.log("================================================");
    console.log("RC297D-E14 PATCH COMPLETE");
    console.log("RC146 test now matches E11F/E13 auth-boundary contract.");
    console.log("No production dashboard auth gate restored.");
    console.log("NO FIREBASE DEPLOYMENT");
    console.log("================================================");

    const { spawnSync } = await import("child_process");

    const test = spawnSync(
        "node",
        [
            "tools/patchAssistant/test/testProtectedDashboardSessionIntegrity.js"
        ],
        { stdio: "inherit" }
    );

    process.exitCode = test.status ?? 1;
}

run();
