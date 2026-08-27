import fs from "fs";

const sidebar = "js/navigation/sidebar.js";
const root = "modules/contribution-draw/index.html";

console.log("===============================================");
console.log("RC345 CONTRIBUTION-DRAW MEMBER ACCESS CONTRACT AUDIT");
console.log("===============================================");

if (!fs.existsSync(sidebar)) {
    console.log(`FILE NOT FOUND: ${sidebar}`);
    process.exit(1);
}

const content = fs.readFileSync(sidebar, "utf8");
const lines = content.split("\n");

const memberStart = lines.findIndex(line =>
    /rolesMatch\s*\(\s*role\s*,\s*["']member["']\s*\)/.test(line)
);

const superStart = lines.findIndex(line =>
    /rolesMatch\s*\(\s*role\s*,\s*["']super_admin["']\s*\)/.test(line)
);

const cooperativeStart = lines.findIndex(line =>
    /rolesMatch\s*\(\s*role\s*,\s*["']cooperative_admin["']\s*\)/.test(line)
);

function branchEnd(start, nextStarts) {
    const candidates = nextStarts
        .filter(value => value > start)
        .sort((a, b) => a - b);

    return candidates.length ? candidates[0] : lines.length;
}

console.log("");
console.log("----- MEMBER BRANCH -----");

if (memberStart >= 0) {
    const end = branchEnd(memberStart, [
        superStart,
        cooperativeStart
    ]);

    for (let i = memberStart; i < end; i++) {
        console.log(`${i + 1}: ${lines[i].trim()}`);
    }
} else {
    console.log("MEMBER BRANCH: NOT FOUND");
}

console.log("");
console.log("----- CONTRIBUTION-DRAW ROOT -----");

if (!fs.existsSync(root)) {
    console.log(`ROOT NOT FOUND: ${root}`);
} else {
    const rootContent = fs.readFileSync(root, "utf8");

    console.log(`ROOT: ${root}`);
    console.log(
        `script.js: ${
            rootContent.includes("script.js") ? "PRESENT" : "ABSENT"
        }`
    );
    console.log(
        `auth.js: ${
            rootContent.includes("auth.js") ? "PRESENT" : "ABSENT"
        }`
    );
    console.log(
        `onAuthStateChanged: ${
            rootContent.includes("onAuthStateChanged") ? "PRESENT" : "ABSENT"
        }`
    );
    console.log(
        `auth.currentUser: ${
            rootContent.includes("auth.currentUser") ? "PRESENT" : "ABSENT"
        }`
    );

    console.log("");
    console.log("ROOT SCRIPT REFERENCES:");

    rootContent.split("\n").forEach((line, index) => {
        if (/<script|src=/.test(line)) {
            console.log(`${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("");
console.log("----- CONTRIBUTION-DRAW APPLICATION SURFACE -----");

const targets = [
    "modules/contribution-draw/index.html",
    "modules/contribution-draw/group-directory/index.html",
    "modules/contribution-draw/group-participants/index.html",
    "modules/contribution-draw/group-profile/index.html"
];

for (const target of targets) {
    console.log("");
    console.log(`TARGET: ${target}`);

    if (!fs.existsSync(target)) {
        console.log("STATUS: NOT FOUND");
        continue;
    }

    const targetContent = fs.readFileSync(target, "utf8");

    for (const signal of [
        "auth.js",
        "script.js",
        "onAuthStateChanged",
        "auth.currentUser",
        "rolesMatch",
        "super_admin",
        "cooperative_admin",
        "member",
        "group-directory",
        "group-participants"
    ]) {
        console.log(
            `${signal}: ${
                targetContent.includes(signal)
                    ? "PRESENT"
                    : "ABSENT"
            }`
        );
    }
}

console.log("");
console.log("----- RC345 DECISION -----");

const memberBranchExists = memberStart >= 0;

const memberBranchHasDraw =
    memberBranchExists &&
    lines
        .slice(
            memberStart,
            branchEnd(memberStart, [
                superStart,
                cooperativeStart
            ])
        )
        .some(line =>
            /contribution-draw|Contribution Draw/.test(line)
        );

const rootExists = fs.existsSync(root);

if (memberBranchHasDraw && rootExists) {
    console.log(
        "RC345 FINDING: CONTRIBUTION-DRAW IS INTENTIONALLY ROUTED THROUGH THE MEMBER SIDEBAR BRANCH."
    );

    console.log(
        "RC345 STATUS: TRACE THE MEMBER-FACING DRAW CONTRACT AT THE ROOT AND CHILD PAGES BEFORE PATCHING SERVICE AUTHORIZATION."
    );
} else {
    console.log(
        "RC345 FINDING: MEMBER CONTRIBUTION-DRAW ROUTING IS NOT FULLY CONFIRMED."
    );

    console.log(
        "RC345 STATUS: CONTINUE ROUTING/AUTHORIZATION TRACE."
    );
}

console.log("");
console.log("===============================================");
console.log("RC345 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC345: NO FILES MODIFIED");
