import fs from "fs";

console.log("===============================================");
console.log("RC378 DRAW GROUP DIRECT WRITE TRACE");
console.log("===============================================");

const roots = [
    "js",
    "components",
    "core",
    "pages",
    "services",
    "functions",
    "tools"
];

const skip = new Set([
    "node_modules",
    ".git",
    "dist",
    "build"
]);

const extensions = [
    ".js",
    ".html",
    ".json",
    ".rules"
];

const files = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    const stat = fs.statSync(dir);
    if (!stat.isDirectory()) return;

    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true
    })) {
        if (skip.has(entry.name)) continue;

        const path = dir + "/" + entry.name;

        if (entry.isDirectory()) {
            walk(path);
            continue;
        }

        if (!extensions.some(ext =>
            entry.name.endsWith(ext)
        )) {
            continue;
        }

        files.push(path);
    }
}

for (const root of roots) {
    walk(root);
}

console.log("");
console.log("FILES SCANNED:", files.length);

const matches = [];

const patterns = [
    /drawGroups/i,
    /drawGroup/i,
    /addDoc\s*\(/i,
    /setDoc\s*\(/i,
    /updateDoc\s*\(/i,
    /batch\s*\(/i
];

for (const file of files) {
    let source;

    try {
        source = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    const lines = source.split("\n");

    lines.forEach((line, index) => {
        if (
            /drawGroups/i.test(line) ||
            (
                /addDoc|setDoc|updateDoc|batch/i.test(line) &&
                /drawGroup/i.test(
                    lines.slice(
                        Math.max(0, index - 8),
                        Math.min(lines.length, index + 9)
                    ).join("\n")
                )
            )
        ) {
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
console.log("ALL DRAW GROUP WRITE / REFERENCE POINTS");
console.log("===============================================");

for (const match of matches) {
    console.log(
        match.file +
        ":" +
        match.line +
        ": " +
        match.text
    );
}

const targetFiles = [
    ...new Set(matches.map(match => match.file))
];

console.log("");
console.log("===============================================");
console.log("TARGETED DRAW GROUP CONTEXT");
console.log("===============================================");

for (const file of targetFiles) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            /drawGroups|drawGroup/i.test(line)
        ) {
            relevant.push(index);
        }
    });

    for (const index of relevant) {
        console.log("");
        console.log(
            "===== " +
            file +
            ":" +
            (index + 1) +
            " ====="
        );

        const start = Math.max(
            0,
            index - 15
        );

        const end = Math.min(
            lines.length,
            index + 25
        );

        for (let i = start; i < end; i++) {
            console.log(
                (i + 1) + ": " +
                lines[i]
            );
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC378 SECURITY DECISION");
console.log("===============================================");

console.log(
    "RC378 REQUIREMENT: IDENTIFY EVERY ACTUAL DRAW GROUP WRITE PATH BEFORE MODIFYING OWNERSHIP."
);

console.log(
    "RC378 REQUIREMENT: cooperativeId MUST EVENTUALLY RESOLVE FROM AN EXISTING AUTHORITATIVE USER/MEMBER/COOPERATIVE RELATIONSHIP."
);

console.log(
    "RC378 REQUIREMENT: DO NOT TRUST CLIENT-SUPPLIED cooperativeId WHEN AN AUTHORITATIVE SERVER-VERIFIABLE RELATIONSHIP EXISTS."
);

console.log(
    "RC378 REQUIREMENT: DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "RC378 REQUIREMENT: DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "RC378 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC378 NEXT DECISION: SELECT THE ACTUAL DRAW GROUP CREATION WRITE PATH FROM THE PRINTED EVIDENCE."
);

console.log("");
console.log("===============================================");
console.log("RC378 AUDIT COMPLETE");
console.log("===============================================");
