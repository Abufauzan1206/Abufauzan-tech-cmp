import fs from "fs";

const targets = [
    "modules/contribution-draw/group-directory/script.js",
    "modules/contribution-draw/group-participants/script.js",
    "modules/contribution-draw/group-profile/script.js"
];

console.log("===============================================");
console.log("RC347 CONTRIBUTION-DRAW SCRIPT AUTHORIZATION AUDIT");
console.log("===============================================");

for (const target of targets) {
    console.log("");
    console.log(`================================================`);
    console.log(`TARGET: ${target}`);
    console.log(`================================================`);

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
        if (/^\s*import\s|^\s*export\s/.test(line)) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });

    console.log("");
    console.log("----- AUTHENTICATION SIGNALS -----");

    const authPatterns = [
        "onAuthStateChanged",
        "auth.currentUser",
        "getAuth",
        "getIdToken",
        "getIdTokenResult",
        "signIn",
        "signOut",
        "currentUser",
        "user.uid",
        "user.email"
    ];

    for (const signal of authPatterns) {
        const matches = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) => line.includes(signal));

        console.log(`${signal}: ${matches.length ? "PRESENT" : "ABSENT"}`);

        for (const match of matches) {
            console.log(`  ${match.index + 1}: ${match.line.trim()}`);
        }
    }

    console.log("");
    console.log("----- ROLE / AUTHORIZATION SIGNALS -----");

    const rolePatterns = [
        "rolesMatch",
        "roleAuthorization",
        "super_admin",
        "cooperative_admin",
        "member",
        "requireRole",
        "isAdmin",
        "isSuperAdmin",
        "role",
        "userData.role"
    ];

    for (const signal of rolePatterns) {
        const matches = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) => line.includes(signal));

        console.log(`${signal}: ${matches.length ? "PRESENT" : "ABSENT"}`);

        for (const match of matches) {
            console.log(`  ${match.index + 1}: ${match.line.trim()}`);
        }
    }

    console.log("");
    console.log("----- FIRESTORE / DATA ACCESS SIGNALS -----");

    const dataPatterns = [
        "getDoc",
        "getDocs",
        "collection",
        "doc(",
        "query(",
        "where(",
        "addDoc",
        "setDoc",
        "updateDoc",
        "deleteDoc",
        "onSnapshot",
        "serverTimestamp",
        "db"
    ];

    for (const signal of dataPatterns) {
        const matches = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) => line.includes(signal));

        console.log(`${signal}: ${matches.length ? "PRESENT" : "ABSENT"}`);

        for (const match of matches) {
            console.log(`  ${match.index + 1}: ${match.line.trim()}`);
        }
    }

    console.log("");
    console.log("----- NAVIGATION / REDIRECT SIGNALS -----");

    const navigationPatterns = [
        "window.location",
        "location.href",
        "location.assign",
        "location.replace",
        "login.html",
        "group-directory",
        "group-participants",
        "group-profile"
    ];

    for (const signal of navigationPatterns) {
        const matches = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) => line.includes(signal));

        console.log(`${signal}: ${matches.length ? "PRESENT" : "ABSENT"}`);

        for (const match of matches) {
            console.log(`  ${match.index + 1}: ${match.line.trim()}`);
        }
    }

    console.log("");
    console.log("----- FUNCTIONS / CONTROL FLOW -----");

    lines.forEach((line, index) => {
        if (
            /^\s*(async\s+)?function\s+/.test(line) ||
            /^\s*(const|let)\s+\w+\s*=\s*(async\s*)?\(/.test(line) ||
            /^\s*(const|let)\s+\w+\s*=\s*(async\s*)?\w+\s*=>/.test(line)
        ) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });

    console.log("");
    console.log("----- CONTRIBUTION DRAW / GROUP SIGNALS -----");

    const drawPatterns = [
        "groupId",
        "group",
        "participant",
        "participants",
        "contribution",
        "draw",
        "winner",
        "month",
        "reserved",
        "admin"
    ];

    for (const signal of drawPatterns) {
        const matches = lines
            .map((line, index) => ({ line, index }))
            .filter(({ line }) =>
                line.toLowerCase().includes(signal.toLowerCase())
            );

        console.log(`${signal}: ${matches.length ? "PRESENT" : "ABSENT"}`);

        for (const match of matches.slice(0, 20)) {
            console.log(`  ${match.index + 1}: ${match.line.trim()}`);
        }

        if (matches.length > 20) {
            console.log(`  ... ${matches.length - 20} additional matches omitted`);
        }
    }

    console.log("");
    console.log("----- COMPLETE SCRIPT -----");

    lines.forEach((line, index) => {
        console.log(`${index + 1}: ${line}`);
    });
}

console.log("");
console.log("===============================================");
console.log("RC347 DECISION");
console.log("===============================================");

const existing = targets.filter(fs.existsSync);

let authCount = 0;
let roleCount = 0;
let firestoreCount = 0;

for (const target of existing) {
    const content = fs.readFileSync(target, "utf8");

    if (
        /onAuthStateChanged|auth\.currentUser|getIdToken|getIdTokenResult|user\.uid/.test(
            content
        )
    ) {
        authCount++;
    }

    if (
        /rolesMatch|roleAuthorization|super_admin|cooperative_admin|requireRole|isAdmin|isSuperAdmin|userData\.role/.test(
            content
        )
    ) {
        roleCount++;
    }

    if (
        /getDoc|getDocs|collection|query\(|where\(|addDoc|setDoc|updateDoc|deleteDoc|onSnapshot/.test(
            content
        )
    ) {
        firestoreCount++;
    }
}

console.log(`SCRIPTS FOUND: ${existing.length}/${targets.length}`);
console.log(`SCRIPTS WITH AUTH SIGNALS: ${authCount}`);
console.log(`SCRIPTS WITH ROLE SIGNALS: ${roleCount}`);
console.log(`SCRIPTS WITH FIRESTORE ACCESS: ${firestoreCount}`);

if (firestoreCount > 0 && authCount === 0 && roleCount === 0) {
    console.log(
        "RC347 FINDING: CONTRIBUTION-DRAW CLIENT SCRIPTS ACCESS DATA WITHOUT DETECTABLE AUTHENTICATION OR ROLE ENFORCEMENT."
    );

    console.log(
        "RC347 STATUS: TRACE FIRESTORE SERVICE / CLOUD FUNCTION AUTHORIZATION BEFORE PATCHING."
    );
} else {
    console.log(
        "RC347 FINDING: CONTRIBUTION-DRAW AUTHORIZATION IS PARTIALLY IMPLEMENTED OR DELEGATED."
    );

    console.log(
        "RC347 STATUS: CORRELATE CLIENT AUTHORIZATION WITH THE BACKEND SERVICE BEFORE PATCHING."
    );
}

console.log("");
console.log("===============================================");
console.log("RC347 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC347: NO FILES MODIFIED");
