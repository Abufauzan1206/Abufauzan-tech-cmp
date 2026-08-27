import fs from "fs";
import path from "path";

const target =
    "modules/contribution-draw/group-profile/script.js";

const references = [];

console.log("===============================================");
console.log("RC338 DRAW GROUP-PROFILE ENTRY-PATH AUDIT");
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
                line.includes("group-profile") ||
                line.includes("groupProfile") ||
                line.includes("group-profile/index.html")
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
console.log("----- ALL GROUP-PROFILE REFERENCES -----");

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
console.log("----- GROUP-PROFILE PAGE HTML -----");

const htmlCandidates = [
    "modules/contribution-draw/group-profile/index.html",
    "modules/contribution-draw/group-profile.html"
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
        "GROUP-PROFILE HTML FILE NOT FOUND."
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
console.log("----- REAL ENTRY CALLER AUTH SIGNALS -----");

const nonAudit = applicationReferences
    .map(ref => ref.file)
    .filter(
        (value, index, array) =>
            array.indexOf(value) === index
    );

for (const file of nonAudit) {
    const content =
        fs.readFileSync(file, "utf8");

    const hasAuth =
        /auth\.currentUser|onAuthStateChanged|requireAuth|user\.uid/.test(
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
console.log("----- RC338 DECISION -----");

if (!applicationReferences.length) {
    console.log(
        "RC338 FINDING: NO REAL APPLICATION ENTRY REFERENCE TO GROUP-PROFILE WAS FOUND."
    );

    console.log(
        "RC338 STATUS: MANUAL NAVIGATION/ENTRY REVIEW REQUIRED."
    );
} else {
    const callerFiles = [
        ...new Set(
            applicationReferences.map(
                ref => ref.file
            )
        )
    ];

    let guarded = false;

    for (const file of callerFiles) {
        const content =
            fs.readFileSync(file, "utf8");

        const hasAuth =
            /auth\.currentUser|onAuthStateChanged|requireAuth|user\.uid/.test(
                content
            );

        const hasRole =
            /rolesMatch|normalizeRole|super_admin|cooperative_admin|requireRole|isAdmin|isSuperAdmin|cooperativeAdmin/.test(
                content
            );

        if (hasAuth && hasRole) {
            guarded = true;
        }
    }

    if (guarded) {
        console.log(
            "RC338 FINDING: GROUP-PROFILE HAS AT LEAST ONE AUTHENTICATED/ROLE-GUARDED APPLICATION ENTRY PATH."
        );

        console.log(
            "RC338 STATUS: TRACE THAT GUARDED PATH BEFORE MODIFYING PARTICIPANT AUTHORIZATION."
        );
    } else {
        console.log(
            "RC338 FINDING: GROUP-PROFILE APPLICATION ENTRY PATH HAS NO DETECTABLE AUTHENTICATION + ROLE GUARD."
        );

        console.log(
            "RC338 STATUS: POTENTIAL ADMIN TRUST-BOUNDARY GAP EXISTS ABOVE GROUP-PROFILE."
        );
    }
}

console.log("");
console.log("===============================================");
console.log("RC338 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC338: NO FILES MODIFIED");
