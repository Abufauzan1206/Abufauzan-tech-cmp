import fs from "fs";
import path from "path";

const target =
    "modules/contribution-draw/group-participants/index.html";

const references = [];

console.log("===============================================");
console.log("RC336 DRAW PARTICIPANT ENTRY-PATH AUDIT");
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
                line.includes("group-participants") ||
                line.includes("groupParticipants")
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
console.log("----- ALL ENTRY REFERENCES -----");

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
console.log("----- ADMIN CONTEXT OF REFERENCES -----");

const adminReferences = references.filter(
    ref =>
        ref.file.includes("admin") ||
        ref.file.includes("super-admin") ||
        ref.file.includes("cooperative-admin")
);

const nonAdminReferences = references.filter(
    ref =>
        !ref.file.includes("admin") &&
        !ref.file.includes("super-admin") &&
        !ref.file.includes("cooperative-admin")
);

console.log(
    `ADMIN-CONTEXT REFERENCES: ${adminReferences.length}`
);

console.log(
    `NON-ADMIN REFERENCES: ${nonAdminReferences.length}`
);

console.log("");
console.log("----- DIRECT PAGE ACCESS SIGNALS -----");

if (!fs.existsSync(target)) {
    console.log(`TARGET PAGE NOT FOUND: ${target}`);
} else {
    const page = fs.readFileSync(target, "utf8");

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
                page.includes(signal)
                    ? "PRESENT"
                    : "ABSENT"
            }`
        );
    }
}

console.log("");
console.log("----- RC336 DECISION -----");

if (
    adminReferences.length > 0 &&
    nonAdminReferences.length === 0
) {
    console.log(
        "RC336 FINDING: GROUP-PARTICIPANTS PAGE IS ENTERED EXCLUSIVELY FROM ADMIN-CONTEXT REFERENCES."
    );

    console.log(
        "RC336 STATUS: VERIFY WHETHER DIRECT URL ACCESS IS STILL REQUIRED TO BE BLOCKED."
    );
} else if (nonAdminReferences.length > 0) {
    console.log(
        "RC336 FINDING: GROUP-PARTICIPANTS PAGE HAS NON-ADMIN ENTRY REFERENCES."
    );

    console.log(
        "RC336 STATUS: SPLIT ENTRY CONTRACT REQUIRES REVIEW."
    );
} else {
    console.log(
        "RC336 FINDING: ENTRY PATH IS NOT CLEARLY ESTABLISHED."
    );

    console.log(
        "RC336 STATUS: MANUAL ENTRY-PATH REVIEW REQUIRED."
    );
}

console.log("");
console.log("===============================================");
console.log("RC336 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC336: NO FILES MODIFIED");
