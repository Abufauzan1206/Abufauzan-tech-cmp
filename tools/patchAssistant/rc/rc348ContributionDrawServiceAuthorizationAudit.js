import fs from "fs";

const targets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js"
];

const signals = [
    "onCall",
    "httpsCallable",
    "getAuth",
    "auth",
    "currentUser",
    "getIdToken",
    "getIdTokenResult",
    "request.auth",
    "context.auth",
    "context.auth.token",
    "claims",
    "role",
    "rolesMatch",
    "super_admin",
    "cooperative_admin",
    "member",
    "requireRole",
    "isAdmin",
    "isSuperAdmin",
    "assertAdmin",
    "authorization",
    "permission",
    "getDoc",
    "getDocs",
    "collection",
    "doc(",
    "addDoc",
    "setDoc",
    "updateDoc",
    "deleteDoc",
    "where("
];

console.log("===============================================");
console.log("RC348 CONTRIBUTION-DRAW SERVICE AUTHORIZATION AUDIT");
console.log("===============================================");

for (const target of targets) {

    console.log("");
    console.log("===============================================");
    console.log(`TARGET: ${target}`);
    console.log("===============================================");

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const content = fs.readFileSync(target, "utf8");
    const lines = content.split("\n");

    console.log(`STATUS: FOUND`);
    console.log(`LINES: ${lines.length}`);

    console.log("");
    console.log("----- IMPORTS -----");

    lines.forEach((line, index) => {
        if (/^\s*import\s/.test(line)) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });

    console.log("");
    console.log("----- AUTHORIZATION SIGNALS -----");

    for (const signal of signals) {

        const matches = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) => line.includes(signal));

        console.log(
            `${signal}: ${matches.length ? "PRESENT" : "ABSENT"}`
        );

        for (const match of matches.slice(0, 5)) {
            console.log(
                `  ${match.index + 1}: ${match.line.trim()}`
            );
        }
    }

    console.log("");
    console.log("----- EXPORTED FUNCTIONS -----");

    lines.forEach((line, index) => {
        if (
            /export\s+(async\s+)?function/.test(line) ||
            /export\s+const\s+\w+\s*=/.test(line)
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });

    console.log("");
    console.log("----- SERVICE CALLS / DATA OPERATIONS -----");

    lines.forEach((line, index) => {
        if (
            /getDoc|getDocs|collection|doc\(|addDoc|setDoc|updateDoc|deleteDoc|where\(|httpsCallable|onCall/.test(line)
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC348 DECISION");
console.log("===============================================");

const existingTargets = targets.filter(fs.existsSync);

let totalAuthSignals = 0;
let totalExportedFunctions = 0;
let totalDataOperations = 0;

for (const target of existingTargets) {

    const content = fs.readFileSync(target, "utf8");

    if (
        /onCall|httpsCallable|request\.auth|context\.auth|rolesMatch|requireRole|authorization|permission|role/.test(content)
    ) {
        totalAuthSignals++;
    }

    if (
        /export\s+(async\s+)?function|export\s+const\s+\w+\s*=/.test(content)
    ) {
        totalExportedFunctions++;
    }

    if (
        /getDoc|getDocs|collection|doc\(|addDoc|setDoc|updateDoc|deleteDoc|where\(/.test(content)
    ) {
        totalDataOperations++;
    }
}

console.log(`SERVICE FILES FOUND: ${existingTargets.length}/${targets.length}`);
console.log(`SERVICE FILES WITH AUTH SIGNALS: ${totalAuthSignals}`);
console.log(`SERVICE FILES WITH EXPORTED FUNCTIONS: ${totalExportedFunctions}`);
console.log(`SERVICE FILES WITH DATA OPERATIONS: ${totalDataOperations}`);

if (
    totalDataOperations > 0 &&
    totalAuthSignals === 0
) {
    console.log(
        "RC348 FINDING: CONTRIBUTION-DRAW SERVICES PERFORM DATA OPERATIONS WITHOUT DETECTABLE AUTHORIZATION SIGNALS."
    );

    console.log(
        "RC348 STATUS: TRACE FIRESTORE RULES / CLOUD FUNCTIONS / CALLED BACKEND SERVICES BEFORE ANY PATCH."
    );
} else {
    console.log(
        "RC348 FINDING: CONTRIBUTION-DRAW SERVICE AUTHORIZATION IS PARTIALLY PRESENT OR DELEGATED."
    );

    console.log(
        "RC348 STATUS: CORRELATE SERVICE AUTHORIZATION WITH FIRESTORE RULES / CLOUD FUNCTIONS BEFORE PATCHING."
    );
}

console.log("");
console.log("===============================================");
console.log("RC348 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC348: NO FILES MODIFIED");
