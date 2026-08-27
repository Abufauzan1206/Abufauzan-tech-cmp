import fs from "fs";
import path from "path";

const ROOT = ".";

const files = [];

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (
            entry.name === "node_modules" ||
            entry.name === ".git"
        ) {
            continue;
        }

        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(full);
        } else if (
            entry.name.endsWith(".js") ||
            entry.name.endsWith(".html")
        ) {
            files.push(full);
        }
    }
}

walk(ROOT);

const patterns = [
    /getDoc\s*\(/i,
    /doc\s*\(\s*db\s*,\s*["']users["']/i,
    /collection\s*\(\s*db\s*,\s*["']users["']/i,
    /userProfile/i,
    /cooperativeId/i,
    /CMPAuth\.currentUser/i,
    /auth\.currentUser/i,
    /onAuthStateChanged/i,
    /getUser/i,
    /profile/i
];

const matches = [];

for (const file of files) {
    let source;

    try {
        source = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    const lines = source.split("\n");

    lines.forEach((line, index) => {
        if (patterns.some(pattern => pattern.test(line))) {
            matches.push({
                file,
                line: index + 1,
                text: line.trim()
            });
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC385 APPLICATION COOPERATIVE PROFILE TRACE");
console.log("===============================================");

console.log("");
console.log("===============================================");
console.log("POSSIBLE PROFILE / cooperativeId SOURCES");
console.log("===============================================");

for (const match of matches) {
    console.log(
        `${match.file}:${match.line}: ${match.text}`
    );
}

console.log("");
console.log("===============================================");
console.log("TARGETED CONTEXT");
console.log("===============================================");

const targetFiles = [
    "js/components/auth.js",
    "js/components/roleAuthorization.js",
    "modules/contribution-draw/create-group/script.js"
];

for (const file of targetFiles) {

    if (!fs.existsSync(file)) {
        continue;
    }

    const lines = fs.readFileSync(file, "utf8").split("\n");

    console.log("");
    console.log(`===== ${file} =====`);

    lines.forEach((line, index) => {
        if (
            /cooperativeId/i.test(line) ||
            /getDoc\s*\(/i.test(line) ||
            /users/i.test(line) ||
            /currentUser/i.test(line) ||
            /onAuthStateChanged/i.test(line) ||
            /profile/i.test(line)
        ) {
            const start = Math.max(0, index - 8);
            const end = Math.min(lines.length, index + 9);

            console.log("");
            console.log(`--- around line ${index + 1} ---`);

            for (let i = start; i < end; i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
        }
    });
}

console.log("");
console.log("===============================================");
console.log("RC385 DECISION RULE");
console.log("===============================================");

console.log(
    "IDENTIFY THE EXISTING APPLICATION-SIDE users/{uid} PROFILE LOADING PATH."
);

console.log(
    "IDENTIFY WHETHER cooperativeId IS ALREADY AVAILABLE THROUGH AN EXISTING PROFILE OBJECT OR SERVICE."
);

console.log(
    "REUSE THAT AUTHORITATIVE cooperativeId SOURCE IF ONE EXISTS."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "DO NOT PATCH createDrawGroup() OR FIRESTORE RULES YET."
);

console.log(
    "RC385 STATUS: AUDIT ONLY — NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC385 AUDIT COMPLETE");
console.log("===============================================");
