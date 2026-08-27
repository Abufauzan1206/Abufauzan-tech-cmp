import fs from "fs";

const serviceTargets = [
    "js/services/drawGroupService.js",
    "js/services/drawParticipantService.js",
    "js/services/drawBoxService.js",
    "js/services/drawPreparationService.js"
];

const backendTargets = [
    "functions",
    "functions/index.js",
    "functions/src",
    "functions/src/index.js",
    "firebase.json",
    "firestore.rules"
];

const signals = [
    "getDoc",
    "getDocs",
    "collection",
    "doc(",
    "addDoc",
    "setDoc",
    "updateDoc",
    "deleteDoc",
    "where(",
    "onSnapshot",
    "httpsCallable",
    "onCall",
    "request.auth",
    "context.auth",
    "context.auth.token",
    "claims",
    "super_admin",
    "cooperative_admin",
    "member",
    "role",
    "authorization",
    "permission",
    "allow read",
    "allow write",
    "allow create",
    "allow update",
    "allow delete"
];

console.log("===============================================");
console.log("RC349 CONTRIBUTION-DRAW BACKEND AUTHORIZATION TRACE AUDIT");
console.log("===============================================");

console.log("");
console.log("----- DRAW SERVICE IMPLEMENTATIONS -----");

for (const target of serviceTargets) {
    console.log("");
    console.log(`===== ${target} =====`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const content = fs.readFileSync(target, "utf8");
    const lines = content.split("\n");

    console.log(`STATUS: FOUND`);
    console.log(`LINES: ${lines.length}`);

    console.log("");
    console.log("EXPORTS:");

    lines.forEach((line, index) => {
        if (
            /export\s+(async\s+)?function/.test(line) ||
            /export\s+const\s+\w+\s*=/.test(line)
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });

    console.log("");
    console.log("DATA / AUTH SIGNALS:");

    for (const signal of signals) {
        const matches = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) => line.includes(signal));

        if (matches.length) {
            console.log(`${signal}: PRESENT`);
            for (const match of matches.slice(0, 5)) {
                console.log(
                    `  ${match.index + 1}: ${match.line.trim()}`
                );
            }
        }
    }
}

console.log("");
console.log("----- FIREBASE / BACKEND SURFACE -----");

for (const target of backendTargets) {
    console.log("");
    console.log(`TARGET: ${target}`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const stat = fs.statSync(target);

    if (stat.isDirectory()) {
        console.log("STATUS: DIRECTORY FOUND");

        const entries = fs.readdirSync(target, {
            withFileTypes: true
        });

        for (const entry of entries.slice(0, 50)) {
            console.log(
                `  ${entry.isDirectory() ? "[DIR]" : "[FILE]"} ${entry.name}`
            );
        }

        continue;
    }

    const content = fs.readFileSync(target, "utf8");
    const lines = content.split("\n");

    console.log("STATUS: FILE FOUND");
    console.log(`LINES: ${lines.length}`);

    for (const signal of signals) {
        const matches = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) => line.includes(signal));

        if (matches.length) {
            console.log(`${signal}: PRESENT`);
            for (const match of matches.slice(0, 5)) {
                console.log(
                    `  ${match.index + 1}: ${match.line.trim()}`
                );
            }
        }
    }
}

console.log("");
console.log("----- FIRESTORE RULES DISCOVERY -----");

const ruleCandidates = [
    "firestore.rules",
    "firestore.rules.js",
    "rules/firestore.rules",
    "firebase/firestore.rules"
];

let rulesFound = false;

for (const target of ruleCandidates) {
    if (!fs.existsSync(target)) {
        continue;
    }

    rulesFound = true;

    console.log("");
    console.log(`RULE FILE: ${target}`);

    const content = fs.readFileSync(target, "utf8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
        if (
            /match\s+\/databases|allow\s+(read|write|create|update|delete)|request\.auth|request\.resource|resource\.data|role|super_admin|cooperative_admin|member|draw/i.test(
                line
            )
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

if (!rulesFound) {
    console.log("FIRESTORE RULE FILE: NOT FOUND IN KNOWN LOCATIONS");
}

console.log("");
console.log("===============================================");
console.log("RC349 DECISION");
console.log("===============================================");

const serviceFilesFound = serviceTargets.filter(fs.existsSync).length;

let directServiceWrites = 0;

for (const target of serviceTargets) {
    if (!fs.existsSync(target)) {
        continue;
    }

    const content = fs.readFileSync(target, "utf8");

    if (
        /addDoc|setDoc|updateDoc|deleteDoc/.test(content)
    ) {
        directServiceWrites++;
    }
}

console.log(
    `DRAW SERVICE FILES FOUND: ${serviceFilesFound}/${serviceTargets.length}`
);

console.log(
    `DRAW SERVICES WITH DIRECT WRITE OPERATIONS: ${directServiceWrites}`
);

console.log(
    `FIRESTORE RULE FILE DISCOVERED: ${rulesFound ? "YES" : "NO"}`
);

if (directServiceWrites > 0 && !rulesFound) {
    console.log(
        "RC349 FINDING: DRAW SERVICES CONTAIN DIRECT WRITE OPERATIONS AND NO FIRESTORE RULE FILE WAS DISCOVERED."
    );

    console.log(
        "RC349 STATUS: DO NOT PATCH CLIENT ACCESS YET. TRACE DEPLOYED FIRESTORE RULES / CLOUD FUNCTIONS / PROJECT CONFIGURATION."
    );
} else if (directServiceWrites > 0 && rulesFound) {
    console.log(
        "RC349 FINDING: DRAW SERVICES PERFORM DIRECT DATA WRITES AND A FIRESTORE RULE SURFACE EXISTS."
    );

    console.log(
        "RC349 STATUS: CORRELATE EACH DRAW COLLECTION WITH ITS RULE BEFORE AUTHORIZATION PATCHING."
    );
} else {
    console.log(
        "RC349 FINDING: DRAW WRITE PATH IS DELEGATED OR NOT YET FULLY LOCATED."
    );

    console.log(
        "RC349 STATUS: TRACE CALLED SERVICES / CLOUD FUNCTIONS / REPOSITORIES BEFORE PATCHING."
    );
}

console.log("");
console.log("===============================================");
console.log("RC349 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC349: NO FILES MODIFIED");
