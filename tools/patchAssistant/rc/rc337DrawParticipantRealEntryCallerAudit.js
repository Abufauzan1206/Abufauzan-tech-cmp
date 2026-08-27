import fs from "fs";

const callerFile =
    "modules/contribution-draw/group-profile/script.js";

console.log("===============================================");
console.log("RC337 DRAW PARTICIPANT REAL ENTRY-CALLER AUDIT");
console.log("===============================================");

if (!fs.existsSync(callerFile)) {
    console.log(`RC337 ERROR: CALLER FILE NOT FOUND: ${callerFile}`);
    process.exit(1);
}

const caller = fs.readFileSync(callerFile, "utf8");
const lines = caller.split("\n");

console.log("");
console.log("----- ENTRY CALL -----");

const entryIndex = lines.findIndex(
    line =>
        line.includes("group-participants/index.html") ||
        line.includes("groupParticipants")
);

if (entryIndex === -1) {
    console.log("NO GROUP-PARTICIPANTS ENTRY CALL FOUND.");
} else {
    const start = Math.max(0, entryIndex - 45);
    const end = Math.min(lines.length, entryIndex + 20);

    console.log(
        lines
            .slice(start, end)
            .map(
                (line, index) =>
                    `${start + index + 1}: ${line}`
            )
            .join("\n")
    );
}

console.log("");
console.log("----- GROUP-PROFILE AUTHORIZATION SIGNALS -----");

const signals = [
    "auth.currentUser",
    "onAuthStateChanged",
    "getIdTokenResult",
    'doc(db, "users", user.uid)',
    "rolesMatch",
    "normalizeRole",
    "super_admin",
    "cooperative_admin",
    "requireAuth",
    "requireRole",
    "isAdmin",
    "isSuperAdmin",
    "cooperativeAdmin",
    "login.html",
    "redirect"
];

for (const signal of signals) {
    console.log(
        `${signal}: ${
            caller.includes(signal)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- GROUP-PROFILE IMPORTS -----");

console.log(
    lines
        .slice(0, 70)
        .map(
            (line, index) =>
                `${index + 1}: ${line}`
        )
        .join("\n")
);

console.log("");
console.log("----- GROUP-PROFILE CONTEXT -----");

for (const pattern of [
    /async function\s+\w+/g,
    /function\s+\w+/g,
    /onAuthStateChanged/g,
    /rolesMatch/g,
    /getDrawGroupById/g,
    /window\.location/g
]) {
    const matches = caller.match(pattern);
    console.log(
        `${pattern}: ${matches ? matches.length : 0} MATCHES`
    );
}

console.log("");
console.log("----- RC337 DECISION -----");

const hasAuth =
    /auth\.currentUser|onAuthStateChanged|requireAuth|user\.uid/.test(
        caller
    );

const hasRole =
    /rolesMatch|normalizeRole|super_admin|cooperative_admin|requireRole|isAdmin|isSuperAdmin|cooperativeAdmin/.test(
        caller
    );

const hasLoginRedirect =
    /login\.html|window\.location/.test(caller);

if (hasAuth && hasRole) {
    console.log(
        "RC337 FINDING: REAL ENTRY CALLER ALREADY CARRIES AUTHENTICATION AND ROLE SIGNALS."
    );

    console.log(
        "RC337 STATUS: TRACE THE EXISTING GROUP-PROFILE AUTH CONTRACT BEFORE CHANGING GROUP-PARTICIPANTS."
    );
} else if (hasAuth || hasRole || hasLoginRedirect) {
    console.log(
        "RC337 FINDING: REAL ENTRY CALLER HAS PARTIAL AUTHORIZATION/SESSION SIGNALS."
    );

    console.log(
        "RC337 STATUS: EXISTING ENTRY GUARD REQUIRES TARGETED REVIEW."
    );
} else {
    console.log(
        "RC337 FINDING: REAL ENTRY CALLER HAS NO DETECTABLE AUTHORIZATION CONTRACT."
    );

    console.log(
        "RC337 STATUS: GROUP-PARTICIPANTS SERVICE WRITE MAY BE REACHABLE THROUGH AN UNGUARDED ADMIN ENTRY."
    );
}

console.log("");
console.log("===============================================");
console.log("RC337 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC337: NO FILES MODIFIED");
