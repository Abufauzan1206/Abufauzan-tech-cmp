import fs from "fs";

console.log("===============================================");
console.log("RC376 DRAW GROUP CREATION ENTRY POINT TRACE");
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

const patterns = [
    /drawGroups/i,
    /drawGroup/i,
    /createDrawGroup/i,
    /create.*group/i,
    /group.*create/i,
    /add.*group/i,
    /group.*add/i,
    /setDoc/i,
    /addDoc/i,
    /collection\([^\n]*drawGroups/i,
    /cooperativeId/i,
    /memberId/i,
    /auth\.currentUser/i,
    /request\.auth/i
];

const files = [];
const matches = [];

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
            patterns.some(pattern =>
                pattern.test(line)
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
console.log("FILES SCANNED:", files.length);
console.log("MATCHED LINES:", matches.length);

console.log("");
console.log("===============================================");
console.log("DRAW GROUP CREATION REFERENCES");
console.log("===============================================");

for (const match of matches) {
    console.log(
        match.file + ":" +
        match.line + ": " +
        match.text
    );
}

const candidateFiles = [
    ...new Set(
        matches
            .filter(match =>
                /drawGroups|drawGroup|create.*group|group.*create|add.*group|group.*add/i
                    .test(match.text)
            )
            .map(match => match.file)
    )
];

console.log("");
console.log("===============================================");
console.log("TARGETED DRAW GROUP CREATION CONTEXT");
console.log("===============================================");

for (const file of candidateFiles) {
    const lines = fs.readFileSync(
        file,
        "utf8"
    ).split("\n");

    const relevant = [];

    lines.forEach((line, index) => {
        if (
            /drawGroups|drawGroup|createDrawGroup|create.*group|group.*create|add.*group|group.*add/i
                .test(line)
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
            index - 12
        );

        const end = Math.min(
            lines.length,
            index + 18
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
console.log("RC376 DECISION");
console.log("===============================================");

console.log(
    "RC376 FINDING: LOCATE THE ACTUAL DRAW GROUP CREATION ENTRY POINT BEFORE MODIFYING OWNERSHIP."
);

console.log(
    "RC376 SECURITY REQUIREMENT: cooperativeId MUST BE RESOLVED FROM THE EXISTING AUTHORITATIVE USER/MEMBER/COOPERATIVE RELATIONSHIP."
);

console.log(
    "RC376 SECURITY REQUIREMENT: DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, adminId, OR CLIENT-SUPPLIED IDENTIFIERS."
);

console.log(
    "RC376 SECURITY REQUIREMENT: DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "RC376 STATUS: NO APPLICATION OR FIRESTORE RULES MODIFIED."
);

console.log(
    "RC376 NEXT DECISION: PATCH ONLY THE SMALLEST SERVER-SIDE DRAW-GROUP CREATION PATH AFTER ITS ACTUAL ENTRY POINT IS IDENTIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC376 AUDIT COMPLETE");
console.log("===============================================");
