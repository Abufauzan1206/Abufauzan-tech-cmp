import fs from "fs";

console.log("===============================================");
console.log("RC381 ACTUAL DRAW GROUPS WRITE TRACE");
console.log("===============================================");

const roots = [
    "functions",
    "js",
    "pages",
    "components",
    "services",
    "index.html"
];

const skip = new Set([
    "node_modules",
    ".git",
    "dist",
    "build"
]);

const extensions = new Set([
    ".js",
    ".html",
    ".json",
    ".rules"
]);

const writePatterns = [
    /setDoc\s*\(/i,
    /addDoc\s*\(/i,
    /\.set\s*\(/i,
    /\.add\s*\(/i,
    /createDrawGroup\s*\(/i,
    /drawGroups/i
];

const drawGroupPatterns = [
    /drawGroups/i,
    /drawGroup/i,
    /createDrawGroup/i,
    /groupData/i,
    /groupName/i
];

const files = [];

function walk(path) {
    if (!fs.existsSync(path)) return;

    const stat = fs.statSync(path);

    if (stat.isFile()) {
        const ext = path.slice(path.lastIndexOf("."));
        if (extensions.has(ext)) files.push(path);
        return;
    }

    if (!stat.isDirectory()) return;

    for (const entry of fs.readdirSync(path, {
        withFileTypes: true
    })) {
        if (skip.has(entry.name)) continue;

        const fullPath = `${path}/${entry.name}`;

        if (entry.isDirectory()) {
            walk(fullPath);
        } else {
            const ext = fullPath.slice(fullPath.lastIndexOf("."));
            if (extensions.has(ext)) files.push(fullPath);
        }
    }
}

for (const root of roots) {
    walk(root);
}

const matches = [];

for (const file of [...new Set(files)].sort()) {
    let source;

    try {
        source = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    const lines = source.split("\n");

    lines.forEach((line, index) => {
        const isWrite = writePatterns.some(
            pattern => pattern.test(line)
        );

        if (!isWrite) return;

        const nearby = lines.slice(
            Math.max(0, index - 15),
            Math.min(lines.length, index + 16)
        );

        const isDrawGroupRelated = nearby.some(
            contextLine =>
                drawGroupPatterns.some(
                    pattern => pattern.test(contextLine)
                )
        );

        if (!isDrawGroupRelated) return;

        matches.push({
            file,
            line: index + 1,
            text: line.trim()
        });
    });
}

console.log("");
console.log("===============================================");
console.log("DRAW GROUP WRITE CANDIDATES");
console.log("===============================================");

if (matches.length === 0) {
    console.log("NO DRAW GROUP WRITE CANDIDATES FOUND.");
} else {
    for (const match of matches) {
        console.log(
            `${match.file}:${match.line}: ${match.text}`
        );
    }
}

console.log("");
console.log("===============================================");
console.log("TARGETED WRITE CONTEXT");
console.log("===============================================");

const candidateFiles = [
    ...new Set(matches.map(match => match.file))
];

for (const file of candidateFiles) {
    const lines = fs.readFileSync(file, "utf8").split("\n");

    const indexes = matches
        .filter(match => match.file === file)
        .map(match => match.line - 1);

    for (const index of indexes) {
        console.log("");
        console.log(
            `===== ${file}:${index + 1} =====`
        );

        const start = Math.max(0, index - 15);
        const end = Math.min(lines.length, index + 25);

        for (let i = start; i < end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}

console.log("");
console.log("===============================================");
console.log("RC381 DECISION");
console.log("===============================================");

console.log(
    "THE ACTUAL DRAW GROUP CREATION WRITE MUST BE IDENTIFIED BEFORE PATCHING."
);

console.log(
    "READ-ONLY drawGroups REFERENCES ARE NOT CREATION PATHS."
);

console.log(
    "DO NOT CREATE ownerId, createdByUserId, OR ANY DUPLICATE OWNERSHIP FIELD."
);

console.log(
    "DO NOT DERIVE cooperativeId FROM uid, groupId, memberId, OR adminId."
);

console.log(
    "RC381 STATUS: AUDIT ONLY — NO FILES MODIFIED."
);

console.log("");
console.log("===============================================");
console.log("RC381 AUDIT COMPLETE");
console.log("===============================================");
