import fs from "fs";
import path from "path";

const root = ".";
const target = "addParticipantToGroup";

console.log("===============================================");
console.log("RC331 DRAW PARTICIPANT CALLER CONTRACT AUDIT");
console.log("===============================================");

const matches = [];

function scanDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
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

        if (!entry.name.endsWith(".js") &&
            !entry.name.endsWith(".html")) {
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
            if (line.includes(target)) {
                matches.push({
                    file: fullPath,
                    line: index + 1,
                    text: line.trim()
                });
            }
        });
    }
}

scanDir(root);

console.log("");
console.log("----- ALL REFERENCES -----");

if (!matches.length) {
    console.log("NO REFERENCES FOUND");
} else {
    for (const match of matches) {
        console.log(
            `${match.file}:${match.line} -> ${match.text}`
        );
    }
}

console.log("");
console.log("----- LIKELY CALLER CATEGORIES -----");

const memberPortal = matches.filter(
    m =>
        m.file.includes("member-portal") ||
        m.file.includes("memberPortal") ||
        m.file.includes("member")
);

const admin = matches.filter(
    m =>
        m.file.includes("admin") ||
        m.file.includes("super-admin") ||
        m.file.includes("cooperative-admin")
);

console.log(
    `MEMBER-RELATED REFERENCES: ${memberPortal.length}`
);

console.log(
    `ADMIN-RELATED REFERENCES: ${admin.length}`
);

console.log("");
console.log("----- CONTRACT DECISION -----");

if (memberPortal.length && admin.length) {
    console.log(
        "RC331 FINDING: FUNCTION APPEARS TO HAVE MULTIPLE TRUST CONTEXTS."
    );
    console.log(
        "RC331 STATUS: SPLIT-CONTRACT REVIEW REQUIRED."
    );
} else if (memberPortal.length) {
    console.log(
        "RC331 FINDING: MEMBER SELF-SERVICE CALLER DETECTED."
    );
    console.log(
        "RC331 STATUS: MEMBER AUTH BOUNDARY LIKELY REQUIRED."
    );
} else if (admin.length) {
    console.log(
        "RC331 FINDING: ADMIN CALLER DETECTED."
    );
    console.log(
        "RC331 STATUS: ADMIN TRUST CONTEXT MUST BE PRESERVED."
    );
} else {
    console.log(
        "RC331 FINDING: CALLER CONTRACT NOT YET ESTABLISHED."
    );
    console.log(
        "RC331 STATUS: MANUAL CONTRACT REVIEW REQUIRED."
    );
}

console.log("");
console.log("===============================================");
console.log("RC331 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC331: NO FILES MODIFIED");
