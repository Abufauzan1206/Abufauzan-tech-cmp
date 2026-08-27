import fs from "fs";
import path from "path";

const target =
    "modules/contribution-draw/index.html";

const references = [];

console.log("===============================================");
console.log("RC340 CONTRIBUTION-DRAW ROOT ENTRY AUDIT");
console.log("===============================================");

function scanDir(dir) {
    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true
    })) {
        if (
            entry.name === ".git" ||
            entry.name === "node_modules" ||
            entry.name === ".firebase"
        ) {
            continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            scanDir(fullPath);
            continue;
        }

        if (
            !entry.name.endsWith(".js") &&
            !entry.name.endsWith(".html")
        ) {
            continue;
        }

        let content;

        try {
            content = fs.readFileSync(fullPath, "utf8");
        } catch {
            continue;
        }

        const lines = content.split("\n");

        lines.forEach((line, index) => {
            if (
                line.includes("contribution-draw/index.html") ||
                line.includes("contribution-draw")
            ) {
                references.push({
                    file: fullPath,
                    line: index + 1,
                    text: line.trim()
                });
            }
        });
    }
}

scanDir(".");

console.log("");
console.log("----- CONTRIBUTION-DRAW REFERENCES -----");

const applicationReferences =
    references.filter(
        ref =>
            !ref.file.startsWith(
                "tools/patchAssistant/"
            )
    );

if (!applicationReferences.length) {
    console.log(
        "NO APPLICATION REFERENCES FOUND."
    );
} else {
    for (const ref of applicationReferences) {
        console.log(
            `${ref.file}:${ref.line} -> ${ref.text}`
        );
    }
}

console.log("");
console.log("----- ROOT PAGE -----");

if (!fs.existsSync(target)) {
    console.log(
        `TARGET NOT FOUND: ${target}`
    );
} else {
    const content =
        fs.readFileSync(target, "utf8");

    console.log(`TARGET: ${target}`);

    console.log("");

    for (const signal of [
        "script.js",
        "auth.js",
        "super-admin.js",
        "cooperative-admin.js",
        "onAuthStateChanged",
        "auth.currentUser",
        "rolesMatch",
        "super_admin",
        "cooperative_admin"
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
    console.log(
        "----- ROOT PAGE SCRIPT REFERENCES -----"
    );

    content
        .split("\n")
        .forEach((line, index) => {
            if (
                /<script|src=/.test(line)
            ) {
                console.log(
                    `${index + 1}: ${line.trim()}`
                );
            }
        });
}

console.log("");
console.log(
    "----- CALLER AUTHORIZATION SIGNALS -----"
);

const callerFiles = [
    ...new Set(
        applicationReferences.map(
            ref => ref.file
        )
    )
];

for (const file of callerFiles) {
    const content =
        fs.readFileSync(file, "utf8");

    const hasAuth =
        /auth\.currentUser|onAuthStateChanged|getIdTokenResult|user\.uid|requireAuth/.test(
            content
        );

    const hasRole =
        /rolesMatch|normalizeRole|super_admin|cooperative_admin|requireRole|isAdmin|isSuperAdmin|cooperativeAdmin/.test(
            content
        );

    console.log("");
    console.log(`FILE: ${file}`);
    console.log(
        `AUTH SIGNAL: ${hasAuth ? "PRESENT" : "ABSENT"}`
    );
    console.log(
        `ROLE SIGNAL: ${hasRole ? "PRESENT" : "ABSENT"}`
    );
}

console.log("");
console.log(
    "----- KNOWN ADMIN DASHBOARD REFERENCES -----"
);

for (const file of [
    "js/super-admin.js",
    "js/cooperative-admin.js",
    "super-admin.html",
    "cooperative-admin.html"
]) {
    if (!fs.existsSync(file)) {
        continue;
    }

    const content =
        fs.readFileSync(file, "utf8");

    console.log("");
    console.log(`FILE: ${file}`);

    for (const signal of [
        "contribution-draw",
        "Contribution Draw",
        "window.location",
        "href"
    ]) {
        console.log(
            `${signal}: ${
                content.includes(signal)
                    ? "PRESENT"
                    : "ABSENT"
            }`
        );
    }
}

console.log("");
console.log("----- RC340 DECISION -----");

const directApplicationEntry =
    applicationReferences.some(
        ref =>
            ref.file !==
                "modules/contribution-draw/index.html" &&
            !ref.file.includes("group-profile") &&
            !ref.file.includes("group-directory") &&
            !ref.file.includes("group-participants")
    );

const guardedCaller =
    callerFiles.some(file => {
        const content =
            fs.readFileSync(file, "utf8");

        return (
            /auth\.currentUser|onAuthStateChanged|getIdTokenResult|user\.uid|requireAuth/.test(
                content
            ) &&
            /rolesMatch|normalizeRole|super_admin|cooperative_admin|requireRole|isAdmin|isSuperAdmin|cooperativeAdmin/.test(
                content
            )
        );
    });

if (guardedCaller) {
    console.log(
        "RC340 FINDING: CONTRIBUTION-DRAW HAS AN UPSTREAM AUTHENTICATED + ROLE-AUTHORIZED CALLER."
    );

    console.log(
        "RC340 STATUS: TRACE THAT CALLER AS THE TRUST BOUNDARY."
    );
} else if (directApplicationEntry) {
    console.log(
        "RC340 FINDING: CONTRIBUTION-DRAW HAS APPLICATION ENTRY REFERENCES WITHOUT A DETECTABLE AUTHORIZATION CONTRACT."
    );

    console.log(
        "RC340 STATUS: CONTRIBUTION-DRAW ROOT REQUIRES AUTHORIZATION REVIEW."
    );
} else {
    console.log(
        "RC340 FINDING: NO GUARDED UPSTREAM ENTRY TO CONTRIBUTION-DRAW WAS DETECTED."
    );

    console.log(
        "RC340 STATUS: ROOT TRUST BOUNDARY REVIEW REQUIRED."
    );
}

console.log("");
console.log("===============================================");
console.log("RC340 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC340: NO FILES MODIFIED");
