import fs from "fs";
import path from "path";

const references = [];

console.log("===============================================");
console.log("RC339 DRAW GROUP-DIRECTORY ENTRY-PATH AUDIT");
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
                line.includes("group-directory") ||
                line.includes("groupDirectory") ||
                line.includes("group-directory/index.html")
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
console.log("----- ALL GROUP-DIRECTORY REFERENCES -----");

if (!references.length) {
    console.log("NO REFERENCES FOUND");
} else {
    for (const ref of references) {
        console.log(
            `${ref.file}:${ref.line} -> ${ref.text}`
        );
    }
}

console.log("");
console.log("----- APPLICATION REFERENCES ONLY -----");

const applicationReferences =
    references.filter(
        ref =>
            !ref.file.startsWith(
                "tools/patchAssistant/"
            )
    );

if (!applicationReferences.length) {
    console.log(
        "NO NON-AUDIT APPLICATION REFERENCES FOUND."
    );
} else {
    for (const ref of applicationReferences) {
        console.log(
            `${ref.file}:${ref.line} -> ${ref.text}`
        );
    }
}

console.log("");
console.log("----- CANDIDATE CALLER AUTHORIZATION -----");

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

    const authSignals = [
        "auth.currentUser",
        "onAuthStateChanged",
        "getIdTokenResult",
        "user.uid",
        "requireAuth"
    ];

    const roleSignals = [
        "rolesMatch",
        "normalizeRole",
        "super_admin",
        "cooperative_admin",
        "requireRole",
        "isAdmin",
        "isSuperAdmin",
        "cooperativeAdmin"
    ];

    const hasAuth =
        authSignals.some(
            signal => content.includes(signal)
        );

    const hasRole =
        roleSignals.some(
            signal => content.includes(signal)
        );

    console.log("");
    console.log(`FILE: ${file}`);
    console.log(
        `AUTH SIGNAL: ${hasAuth ? "PRESENT" : "ABSENT"}`
    );
    console.log(
        `ROLE SIGNAL: ${hasRole ? "PRESENT" : "ABSENT"}`
    );

    for (const signal of [
        ...authSignals,
        ...roleSignals
    ]) {
        if (content.includes(signal)) {
            console.log(
                `  ${signal}: PRESENT`
            );
        }
    }
}

console.log("");
console.log("----- GROUP-DIRECTORY HTML -----");

const htmlCandidates = [
    "modules/contribution-draw/group-directory/index.html",
    "modules/contribution-draw/group-directory.html"
];

let htmlFile = null;

for (const candidate of htmlCandidates) {
    if (fs.existsSync(candidate)) {
        htmlFile = candidate;
        break;
    }
}

if (!htmlFile) {
    console.log(
        "GROUP-DIRECTORY HTML FILE NOT FOUND."
    );
} else {
    const html =
        fs.readFileSync(htmlFile, "utf8");

    console.log(
        `HTML FILE: ${htmlFile}`
    );

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
                html.includes(signal)
                    ? "PRESENT"
                    : "ABSENT"
            }`
        );
    }

    console.log("");
    console.log("----- HTML SCRIPT REFERENCES -----");

    html
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
console.log("----- KNOWN ADMIN ENTRY CANDIDATES -----");

const adminCandidates = [
    "super-admin.html",
    "cooperative-admin.html",
    "js/super-admin.js",
    "js/cooperative-admin.js"
];

for (const file of adminCandidates) {
    if (!fs.existsSync(file)) {
        continue;
    }

    const content =
        fs.readFileSync(file, "utf8");

    console.log("");
    console.log(`FILE: ${file}`);

    for (const signal of [
        "group-directory",
        "groupDirectory",
        "contribution-draw",
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
console.log("----- RC339 DECISION -----");

if (!applicationReferences.length) {
    console.log(
        "RC339 FINDING: GROUP-DIRECTORY ENTRY PATH IS NOT ESTABLISHED."
    );

    console.log(
        "RC339 STATUS: MANUAL ENTRY-PATH REVIEW REQUIRED."
    );
} else {
    const guarded =
        callerFiles.some(file => {
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

            return hasAuth && hasRole;
        });

    if (guarded) {
        console.log(
            "RC339 FINDING: A GROUP-DIRECTORY ENTRY CALLER HAS AUTHENTICATION + ROLE SIGNALS."
        );

        console.log(
            "RC339 STATUS: TRACE THAT GUARDED ENTRY CONTRACT BEFORE PATCHING DRAW PARTICIPANT SERVICE."
        );
    } else {
        console.log(
            "RC339 FINDING: GROUP-DIRECTORY APPLICATION ENTRY PATH HAS NO DETECTABLE AUTHENTICATION + ROLE GUARD."
        );

        console.log(
            "RC339 STATUS: ADMIN TRUST BOUNDARY MAY BEGIN ABOVE GROUP-DIRECTORY."
        );
    }
}

console.log("");
console.log("===============================================");
console.log("RC339 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC339: NO FILES MODIFIED");
