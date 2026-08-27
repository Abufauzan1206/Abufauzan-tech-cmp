import fs from "fs";

const targets = [
    "modules/contribution-draw/index.html",
    "modules/contribution-draw/group-directory/index.html",
    "modules/contribution-draw/group-participants/index.html",
    "modules/contribution-draw/group-profile/index.html"
];

console.log("===============================================");
console.log("RC346 CONTRIBUTION-DRAW CHILD SCRIPT TRUST AUDIT");
console.log("===============================================");

for (const target of targets) {
    console.log("");
    console.log(`===== TARGET: ${target} =====`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const html = fs.readFileSync(target, "utf8");
    const lines = html.split("\n");

    console.log(`STATUS: FOUND`);

    console.log("");
    console.log("----- SCRIPT REFERENCES -----");

    const scriptLines = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => /<script|src=/.test(line));

    if (!scriptLines.length) {
        console.log("SCRIPT REFERENCES: NONE");
    } else {
        for (const { line, index } of scriptLines) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    }

    console.log("");
    console.log("----- AUTH / ROLE SIGNALS -----");

    const signals = [
        "onAuthStateChanged",
        "auth.currentUser",
        "getIdTokenResult",
        "user.uid",
        "rolesMatch",
        "roleAuthorization",
        "super_admin",
        "cooperative_admin",
        "member",
        "requireRole",
        "isAdmin",
        "isSuperAdmin",
        "redirect",
        "window.location",
        "login.html"
    ];

    for (const signal of signals) {
        console.log(
            `${signal}: ${html.includes(signal) ? "PRESENT" : "ABSENT"}`
        );
    }

    console.log("");
    console.log("----- IMPORT / MODULE REFERENCES -----");

    for (const { line, index } of lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) =>
            /import\s|from\s+["']|type=["']module["']/.test(line)
        )) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
}

console.log("");
console.log("===============================================");
console.log("RC346 DECISION");
console.log("===============================================");

const existingTargets = targets.filter(fs.existsSync);

let pagesWithScripts = 0;
let pagesWithAuth = 0;
let pagesWithRole = 0;

for (const target of existingTargets) {
    const content = fs.readFileSync(target, "utf8");

    if (/<script|src=/.test(content)) {
        pagesWithScripts++;
    }

    if (
        /onAuthStateChanged|auth\.currentUser|getIdTokenResult|user\.uid/.test(
            content
        )
    ) {
        pagesWithAuth++;
    }

    if (
        /rolesMatch|roleAuthorization|super_admin|cooperative_admin|requireRole|isAdmin|isSuperAdmin/.test(
            content
        )
    ) {
        pagesWithRole++;
    }
}

console.log(
    `DRAW PAGES FOUND: ${existingTargets.length}/${targets.length}`
);
console.log(`DRAW PAGES WITH SCRIPT REFERENCES: ${pagesWithScripts}`);
console.log(`DRAW PAGES WITH DIRECT AUTH SIGNALS: ${pagesWithAuth}`);
console.log(`DRAW PAGES WITH DIRECT ROLE SIGNALS: ${pagesWithRole}`);

if (pagesWithScripts > 0 && pagesWithAuth === 0 && pagesWithRole === 0) {
    console.log(
        "RC346 FINDING: CONTRIBUTION-DRAW PAGES DELEGATE BEHAVIOR TO CHILD SCRIPTS WITHOUT A DETECTABLE PAGE-LEVEL AUTHORIZATION GUARD."
    );

    console.log(
        "RC346 STATUS: TRACE THE REFERENCED CHILD SCRIPTS BEFORE PATCHING AUTHORIZATION."
    );
} else {
    console.log(
        "RC346 FINDING: CONTRIBUTION-DRAW PAGE-LEVEL TRUST SIGNALS REQUIRE CHILD-SCRIPT CORRELATION."
    );

    console.log(
        "RC346 STATUS: TRACE SCRIPT IMPLEMENTATIONS AND THEIR CALLERS BEFORE PATCHING."
    );
}

console.log("");
console.log("===============================================");
console.log("RC346 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC346: NO FILES MODIFIED");
