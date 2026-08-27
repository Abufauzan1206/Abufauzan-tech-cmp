import fs from "fs";

const files = [
    "js/firebase-config.js",
    "js/auth.js",
    "js/cooperative-admin.js",
    "js/navigation/sidebar.js"
];

console.log("================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC297D-E19 — FIREBASE AUTH INITIALIZATION/PERSISTENCE CONTRACT AUDIT");
console.log("================================================");
console.log("");

for (const file of files) {
    console.log(`=== ${file} ===`);

    if (!fs.existsSync(file)) {
        console.log("FILE NOT FOUND");
        console.log("");
        continue;
    }

    const source = fs.readFileSync(file, "utf8");

    const authImports =
        source.match(/from\s+["'][^"']*firebase-auth[^"']*["']/g) || [];

    const initializeAuth =
        source.match(/initializeAuth\s*\(/g) || [];

    const getAuth =
        source.match(/getAuth\s*\(/g) || [];

    const persistence =
        source.match(
            /browserLocalPersistence|browserSessionPersistence|inMemoryPersistence|setPersistence\s*\(/g
        ) || [];

    const onAuth =
        source.match(/onAuthStateChanged\s*\(/g) || [];

    const currentUser =
        source.match(/auth\.currentUser/g) || [];

    console.log("Firebase Auth imports:", authImports.length);
    console.log("initializeAuth():", initializeAuth.length);
    console.log("getAuth():", getAuth.length);
    console.log("Persistence configuration references:", persistence.length);
    console.log("onAuthStateChanged():", onAuth.length);
    console.log("auth.currentUser references:", currentUser.length);
    console.log("");
}

console.log("=== firebase-config.js AUTH CONTENT ===");

if (fs.existsSync("js/firebase-config.js")) {
    const source = fs.readFileSync(
        "js/firebase-config.js",
        "utf8"
    );

    const lines = source.split("\n");

    lines.forEach((line, index) => {
        if (
            /auth|initializeApp|initializeAuth|getAuth|persistence/i.test(
                line
            )
        ) {
            console.log(
                `${String(index + 1).padStart(4, " ")}  ${line}`
            );
        }
    });
}

console.log("");

console.log("=== AUTH.JS AUTH CONTENT ===");

if (fs.existsSync("js/auth.js")) {
    const source = fs.readFileSync(
        "js/auth.js",
        "utf8"
    );

    const lines = source.split("\n");

    lines.forEach((line, index) => {
        if (
            /auth|onAuthStateChanged|signIn|signOut|persistence|redirect/i.test(
                line
            )
        ) {
            console.log(
                `${String(index + 1).padStart(4, " ")}  ${line}`
            );
        }
    });
}

console.log("");

console.log("=== COOPERATIVE ADMIN AUTH IMPORT ===");

const cooperativeAdmin = fs.readFileSync(
    "js/cooperative-admin.js",
    "utf8"
);

console.log(
    cooperativeAdmin
        .split("\n")
        .slice(0, 45)
        .map(
            (line, index) =>
                `${String(index + 1).padStart(4, " ")}  ${line}`
        )
        .join("\n")
);

console.log("");

console.log("=== SIDEBAR AUTH IMPORT ===");

const sidebar = fs.readFileSync(
    "js/navigation/sidebar.js",
    "utf8"
);

console.log(
    sidebar
        .split("\n")
        .slice(0, 15)
        .map(
            (line, index) =>
                `${String(index + 1).padStart(4, " ")}  ${line}`
        )
        .join("\n")
);

console.log("");

console.log("================================================");
console.log("RC297D-E19 — AUDIT COMPLETE");
console.log("NO PATCH APPLIED");
console.log("NO FIREBASE DEPLOYMENT");
console.log("================================================");
