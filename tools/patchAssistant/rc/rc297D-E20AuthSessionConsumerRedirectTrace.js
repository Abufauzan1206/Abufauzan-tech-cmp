import fs from "fs";

const files = [
    "index.html",
    "login.html",
    "super-admin.html",
    "cooperative-admin.html",
    "js/auth.js",
    "js/firebase-config.js",
    "js/cooperative-admin.js",
    "js/navigation/sidebar.js",
    "js/layout.js"
];

console.log("================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC297D-E20 — AUTH SESSION CONSUMER / REDIRECT TRACE AUDIT");
console.log("================================================");

for (const file of files) {
    if (!fs.existsSync(file)) {
        console.log(`\n=== ${file} ===`);
        console.log("FILE NOT FOUND");
        continue;
    }

    const content = fs.readFileSync(file, "utf8");

    console.log(`\n=== ${file} ===`);

    const lines = content.split("\n");

    lines.forEach((line, index) => {
        if (
            /onAuthStateChanged\s*\(/.test(line) ||
            /auth\.currentUser/.test(line) ||
            /window\.location\.(href|replace|assign)/.test(line) ||
            /location\.(href|replace|assign)/.test(line) ||
            /signOut\s*\(/.test(line) ||
            /getAuth\s*\(/.test(line) ||
            /initializeAuth\s*\(/.test(line) ||
            /setPersistence\s*\(/.test(line) ||
            /browserLocalPersistence/.test(line) ||
            /browserSessionPersistence/.test(line) ||
            /inMemoryPersistence/.test(line)
        ) {
            const start = Math.max(0, index - 2);
            const end = Math.min(lines.length, index + 3);

            console.log(
                lines
                    .slice(start, end)
                    .map(
                        (entry, offset) =>
                            `${String(start + offset + 1).padStart(4, " ")}  ${entry}`
                    )
                    .join("\n")
            );

            console.log("---");
        }
    });
}

console.log("\n=== AUTH SCRIPT TAGS ===");

for (const file of [
    "index.html",
    "login.html",
    "super-admin.html",
    "cooperative-admin.html"
]) {
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, "utf8");

    console.log(`\n--- ${file} ---`);

    content
        .split("\n")
        .forEach((line, index) => {
            if (
                /<script/i.test(line) ||
                /type=["']module["']/i.test(line) ||
                /js\/auth\.js/.test(line) ||
                /js\/firebase-config\.js/.test(line) ||
                /js\/cooperative-admin\.js/.test(line) ||
                /js\/layout\.js/.test(line)
            ) {
                console.log(
                    `${String(index + 1).padStart(4, " ")}  ${line}`
                );
            }
        });
}

console.log("\n=== REDIRECT TARGET INVENTORY ===");

const rootFiles = fs
    .readdirSync(".")
    .filter(name => name.endsWith(".html"));

for (const file of rootFiles) {
    const content = fs.readFileSync(file, "utf8");

    const matches = [
        ...content.matchAll(
            /(?:window\.)?location\.(?:href|replace|assign)\s*(?:=|\()\s*["'`]([^"'`]+)["'`]/g
        )
    ];

    if (matches.length) {
        console.log(`\n${file}:`);
        for (const match of matches) {
            console.log(`  -> ${match[1]}`);
        }
    }
}

console.log("\n=== STATIC AUTH IMPORT DUPLICATION CHECK ===");

for (const file of [
    "js/firebase-config.js",
    "js/auth.js",
    "js/cooperative-admin.js",
    "js/navigation/sidebar.js",
    "js/layout.js"
]) {
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, "utf8");

    const firebaseAuthImports = (
        content.match(
            /from\s+["']https:\/\/www\.gstatic\.com\/firebasejs\/12\.0\.0\/firebase-auth\.js["']/g
        ) || []
    ).length;

    console.log(
        `${file}: direct firebase-auth imports = ${firebaseAuthImports}`
    );
}

console.log("\n=== AUDIT DECISION ===");
console.log("No patch applied.");
console.log("No Firebase deployment.");
console.log("This RC only traces competing session consumers and redirects.");

console.log("================================================");
console.log("RC297D-E20 — AUDIT COMPLETE");
console.log("NO PATCH APPLIED");
console.log("NO FIREBASE DEPLOYMENT");
console.log("================================================");
