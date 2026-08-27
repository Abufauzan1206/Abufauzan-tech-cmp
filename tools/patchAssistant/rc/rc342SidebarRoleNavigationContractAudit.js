import fs from "fs";

const file = "js/navigation/sidebar.js";

console.log("===============================================");
console.log("RC342 SIDEBAR ROLE-TO-NAVIGATION CONTRACT AUDIT");
console.log("===============================================");

if (!fs.existsSync(file)) {
    console.log(`FILE NOT FOUND: ${file}`);
    process.exit(1);
}

const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

console.log("");
console.log("----- ROLE BRANCHES -----");

lines.forEach((line, index) => {
    if (
        /rolesMatch|super_admin|cooperative_admin|member/.test(line)
    ) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log("");
console.log("----- CONTRIBUTION-DRAW CONTEXT -----");

lines.forEach((line, index) => {
    if (
        /contribution-draw|Contribution Draw/.test(line)
    ) {
        const start = Math.max(0, index - 12);
        const end = Math.min(lines.length, index + 13);

        console.log("");
        console.log(
            `--- context around line ${index + 1} ---`
        );

        for (let i = start; i < end; i++) {
            console.log(
                `${i + 1}: ${lines[i].trim()}`
            );
        }
    }
});

console.log("");
console.log("----- NAVIGATION CONSTRUCTION SIGNALS -----");

for (const signal of [
    "menuData",
    "menu-data",
    "menuItems",
    "filter",
    "role",
    "render",
    "sidebar",
    "innerHTML",
    "href",
    "window.location"
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
console.log("----- SESSION HANDLING -----");

lines.forEach((line, index) => {
    if (
        /onAuthStateChanged|user\.uid|window\.location\.href|login\.html/.test(
            line
        )
    ) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log("");
console.log("----- RC342 DECISION -----");

const hasRoleBranches =
    /rolesMatch\s*\(\s*role\s*,\s*["']super_admin["']\s*\)/.test(content) &&
    /rolesMatch\s*\(\s*role\s*,\s*["']cooperative_admin["']\s*\)/.test(content) &&
    /rolesMatch\s*\(\s*role\s*,\s*["']member["']\s*\)/.test(content);

const hasContributionDraw =
    /contribution-draw/.test(content);

if (
    hasRoleBranches &&
    hasContributionDraw
) {
    console.log(
        "RC342 FINDING: SIDEBAR HAS EXPLICIT ROLE-SPECIFIC NAVIGATION BRANCHES AND A CONTRIBUTION-DRAW ROUTE."
    );

    console.log(
        "RC342 STATUS: DETERMINE WHICH ROLE BRANCH EXPOSES CONTRIBUTION-DRAW AND WHETHER THAT BRANCH IS THE INTENDED ADMIN TRUST BOUNDARY."
    );
} else {
    console.log(
        "RC342 FINDING: SIDEBAR ROLE-TO-CONTRIBUTION-DRAW CONTRACT IS NOT COMPLETELY DETECTABLE."
    );

    console.log(
        "RC342 STATUS: CONTINUE AUTHORIZATION TRACE."
    );
}

console.log("");
console.log("===============================================");
console.log("RC342 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC342: NO FILES MODIFIED");
