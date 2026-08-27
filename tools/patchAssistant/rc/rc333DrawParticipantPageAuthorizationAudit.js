import fs from "fs";

const callerFile =
    "modules/contribution-draw/group-participants/script.js";

const htmlCandidates = [
    "modules/contribution-draw/group-participants/index.html",
    "modules/contribution-draw/group-participants.html",
    "modules/contribution-draw/group-participants/index.htm"
];

const caller = fs.readFileSync(
    callerFile,
    "utf8"
);

console.log("===============================================");
console.log("RC333 DRAW PARTICIPANT PAGE AUTHORIZATION AUDIT");
console.log("===============================================");

console.log("");
console.log("----- CALLER AUTHORIZATION SIGNALS -----");

const authSignals = [
    "auth.currentUser",
    "onAuthStateChanged",
    "getAuth",
    "requireAuth",
    "requireRole",
    "role",
    "superAdmin",
    "cooperativeAdmin",
    "admin",
    "isAdmin",
    "isSuperAdmin",
    "user.uid"
];

for (const signal of authSignals) {
    console.log(
        `${signal}: ${
            caller.includes(signal)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- CALLER IMPORTS -----");

console.log(
    caller
        .split("\n")
        .slice(0, 35)
        .map((line, index) =>
            `${index + 1}: ${line}`
        )
        .join("\n")
);

console.log("");
console.log("----- PAGE HTML CANDIDATES -----");

let htmlFile = null;

for (const candidate of htmlCandidates) {
    if (fs.existsSync(candidate)) {
        htmlFile = candidate;
        break;
    }
}

if (!htmlFile) {
    console.log(
        "NO STANDARD GROUP-PARTICIPANTS HTML FILE FOUND."
    );
} else {
    console.log(`HTML FILE: ${htmlFile}`);

    const html = fs.readFileSync(
        htmlFile,
        "utf8"
    );

    console.log("");
    console.log("----- HTML SCRIPT / AUTH SIGNALS -----");

    for (const signal of [
        "auth",
        "auth.js",
        "currentUser",
        "onAuthStateChanged",
        "super-admin",
        "cooperative-admin",
        "admin",
        "role"
    ]) {
        console.log(
            `${signal}: ${
                html.includes(signal)
                    ? "PRESENT"
                    : "ABSENT"
            }`
        );
    }

    console.log("");
    console.log("----- HTML SCRIPT REFERENCES -----");

    console.log(
        html
            .split("\n")
            .filter(line =>
                /<script|src=/.test(line)
            )
            .map((line, index) =>
                `${index + 1}: ${line.trim()}`
            )
            .join("\n")
    );
}

console.log("");
console.log("----- CALLER ACCESS CONTROL FUNCTIONS -----");

const accessFunctions = [
    "loadPage",
    "getMembers",
    "getDrawGroupById",
    "addToGroup"
];

for (const fn of accessFunctions) {
    console.log(
        `${fn}: ${
            new RegExp(
                `(?:async\\s+)?function\\s+${fn}\\b`
            ).test(caller)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- DECISION -----");

const callerHasAuth =
    /auth\.currentUser|onAuthStateChanged|requireAuth|user\.uid/.test(
        caller
    );

const callerHasRole =
    /requireRole|superAdmin|cooperativeAdmin|isAdmin|isSuperAdmin|\brole\b/.test(
        caller
    );

const htmlHasAuth =
    htmlFile &&
    /auth|auth\.js|currentUser|onAuthStateChanged|requireAuth/.test(
        fs.readFileSync(htmlFile, "utf8")
    );

if (callerHasAuth || callerHasRole || htmlHasAuth) {
    console.log(
        "RC333 FINDING: PAGE-LEVEL AUTHORIZATION SIGNAL DETECTED."
    );
    console.log(
        "RC333 STATUS: TRACE EXISTING AUTHORIZATION BEFORE PATCHING SERVICE."
    );
} else {
    console.log(
        "RC333 FINDING: NO PAGE-LEVEL AUTHORIZATION SIGNAL DETECTED."
    );
    console.log(
        "RC333 STATUS: REVIEW REQUIRED — ADMIN TRUST BOUNDARY MAY BE MISSING."
    );
}

console.log("");
console.log("===============================================");
console.log("RC333 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC333: NO FILES MODIFIED");
