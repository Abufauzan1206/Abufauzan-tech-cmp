import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/super-admin.js",
        mode: "text",
        search: `    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });
}`,
        replace: `    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });

    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            window.location.reload();
        }
    });
}`
    }
];

async function run() {
    console.log("================================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC297D-E11F — SUPER ADMIN HISTORY VISIBILITY REPAIR");
    console.log("================================================");

    const result = await transaction(patches);

    console.log("RC297D-E11F TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;
        console.log("================================================");
        console.log("RC297D-E11F PATCH FAIL");
        console.log("================================================");
        return;
    }

    console.log("================================================");
    console.log("RC297D-E11F PATCH COMPLETE");
    console.log("Super Admin visibilitychange guard restored.");
    console.log("No auth.currentUser gate restored.");
    console.log("NO FIREBASE DEPLOYMENT");
    console.log("================================================");
}

run();
