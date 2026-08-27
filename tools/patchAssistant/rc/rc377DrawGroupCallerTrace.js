import fs from "fs";

console.log("===============================================");
console.log("RC377 DRAW GROUP CALLER / PAYLOAD TRACE");
console.log("===============================================");

const roots = [
    "js",
    "components",
    "core",
    "pages",
    "services",
    "functions"
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

const callMatches = [];

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
            /createDrawGroup\s*\(/i.test(line) ||
            /drawGroupService/i.test(line) ||
            /from .*drawGroupService/i.test(line)
        ) {
            callMatches.push({
                file,
                line: index + 1,
                text: line.trim()
            });
        }
    });
}

console.log("");
console.log("===============================================");
console.log("createDrawGroup CALL REFERENCES");
console.log("===============================================");

for (const match of callMatches) {
    console.log(
        match.file + ":" +
        match.line + ": " +
        match.text
    );
}

const callerFiles = [
    ...new Set(
        callMatches.map(match => match.file)
    )
];

console.log("");
console.log("===============================================");
console.log("CALLER CONTEXT");
console.log("===============================================");

for (const file of callerFiles) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            /createDrawGroup\s*\(/i.test(line) ||
            /drawGroupService/i.test(line)
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
            index - 20
        );

        const end = Math.min(
            lines.length,
            index + 30
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
console.log("RC377 SECURITY ANALYSIS");
console.log("===============================================");

console.log(
    "RC377 REQUIREMENT: IDENTIFY THE COMPLETE SERVER-VERIFIABLE OWNERSHIP PATH BEFORE PATCHING."
);

console.log(
    "RC377 REQUIREMENT: cooperativeId MUST COME FROM THE EXISTING AUTHORITATIVE USER/MEMBER PROFILE RELATIONSHIP."
);

console.log(
    "RC377 REQUIREMENT: CLIENT-SUPPLIED cooperativeId MUST NOT OVERRIDE AN AUTHORITATIVE PROFILE VALUE."
);

console.log(
    "RC377 REQUIREMENT: DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "RC377 REQUIREMENT: DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "RC377 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC377 NEXT DECISION: PATCH ONLY THE SMALLEST SERVER-SIDE OWNERSHIP RESOLUTION PATH AFTER ALL createDrawGroup CALLERS ARE IDENTIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC377 AUDIT COMPLETE");
console.log("===============================================");
