import fs from "fs";

const file =
    "js/navigation/sidebar.js";

console.log("===============================================");
console.log("RC341 SIDEBAR CONTRIBUTION-DRAW AUTHORIZATION AUDIT");
console.log("===============================================");

if (!fs.existsSync(file)) {
    console.log(`FILE NOT FOUND: ${file}`);
    process.exit(1);
}

const content =
    fs.readFileSync(file, "utf8");

const lines =
    content.split("\n");

console.log("");
console.log("----- AUTHENTICATION SIGNALS -----");

for (const signal of [
    "auth.currentUser",
    "onAuthStateChanged",
    "getIdTokenResult",
    "user.uid",
    "auth.js"
]) {
    console.log(
        `${signal}: ${
            content.includes(signal)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- ROLE SIGNALS -----");

for (const signal of [
    "rolesMatch",
    "normalizeRole",
    "super_admin",
    "cooperative_admin",
    "member",
    "requireRole",
    "isAdmin",
    "isSuperAdmin"
]) {
    console.log(
        `${signal}: ${
            content.includes(signal)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- CONTRIBUTION-DRAW REFERENCES -----");

lines.forEach((line, index) => {
    if (
        /contribution-draw|Contribution Draw|menu-data|url:/.test(
            line
        )
    ) {
        console.log(
            `${index + 1}: ${line.trim()}`
        );
    }
});

console.log("");
console.log("----- AUTHORIZATION-RELEVANT LINES -----");

lines.forEach((line, index) => {
    if (
        /auth\.currentUser|onAuthStateChanged|getIdTokenResult|rolesMatch|normalizeRole|super_admin|cooperative_admin|member|requireRole|isAdmin|isSuperAdmin|redirect|location/.test(
            line
        )
    ) {
        console.log(
            `${index + 1}: ${line.trim()}`
        );
    }
});

console.log("");
console.log("----- DECISION -----");

const hasAuthentication =
    /auth\.currentUser|onAuthStateChanged|getIdTokenResult|user\.uid/.test(
        content
    );

const hasRoleAuthorization =
    /rolesMatch|normalizeRole|super_admin|cooperative_admin|requireRole|isAdmin|isSuperAdmin/.test(
        content
    );

const hasContributionDraw =
    /contribution-draw/.test(
        content
    );

if (
    hasAuthentication &&
    hasRoleAuthorization &&
    hasContributionDraw
) {
    console.log(
        "RC341 FINDING: SIDEBAR CONTAINS AUTHENTICATION, ROLE AUTHORIZATION, AND CONTRIBUTION-DRAW NAVIGATION."
    );

    console.log(
        "RC341 STATUS: INSPECT THE ACTUAL ROLE FILTER/GUARD LOGIC BEFORE PATCHING ANY CHILD PAGE OR SERVICE."
    );
} else {
    console.log(
        "RC341 FINDING: SIDEBAR DOES NOT PROVIDE A COMPLETE DETECTABLE TRUST BOUNDARY."
    );

    console.log(
        "RC341 STATUS: CONTINUE UPSTREAM AUTHORIZATION TRACE."
    );
}

console.log("");
console.log("===============================================");
console.log("RC341 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC341: NO FILES MODIFIED");
