import fs from "fs";

console.log("================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC297D-E22 — COOPERATIVE ADMIN DUAL LISTENER ORDERING TRACE");
console.log("================================================");

const files = {
    cooperativeAdmin: fs.readFileSync(
        "js/cooperative-admin.js",
        "utf8"
    ),
    sidebar: fs.readFileSync(
        "js/navigation/sidebar.js",
        "utf8"
    ),
    firebaseConfig: fs.readFileSync(
        "js/firebase-config.js",
        "utf8"
    )
};

function linesContaining(text, pattern) {
    return text
        .split("\n")
        .map((line, index) => ({
            line: index + 1,
            text: line
        }))
        .filter(item => pattern.test(item.text));
}

console.log("");
console.log("=== COOPERATIVE ADMIN AUTH LISTENER ===");

for (const item of linesContaining(
    files.cooperativeAdmin,
    /onAuthStateChanged|buildAuthenticatedSidebar|window\.location\.href|signOut|getDoc/
)) {
    console.log(
        `${String(item.line).padStart(4, " ")}  ${item.text}`
    );
}

console.log("");
console.log("=== SIDEBAR AUTH LISTENER ===");

for (const item of linesContaining(
    files.sidebar,
    /onAuthStateChanged|window\.location\.href|signOut|getDoc|buildSidebar/
)) {
    console.log(
        `${String(item.line).padStart(4, " ")}  ${item.text}`
    );
}

console.log("");
console.log("=== AUTH INSTANCE SOURCE ===");

for (const item of linesContaining(
    files.firebaseConfig,
    /initializeApp|getAuth|export const auth/
)) {
    console.log(
        `${String(item.line).padStart(4, " ")}  ${item.text}`
    );
}

console.log("");
console.log("=== LISTENER ORDER ===");

const cooperativeIndex =
    files.cooperativeAdmin.indexOf("buildAuthenticatedSidebar");

const authListenerIndex =
    files.cooperativeAdmin.indexOf("onAuthStateChanged(auth");

if (
    cooperativeIndex !== -1 &&
    authListenerIndex !== -1
) {
    console.log(
        cooperativeIndex < authListenerIndex
            ? "buildAuthenticatedSidebar() is registered BEFORE cooperative-admin auth listener."
            : "cooperative-admin auth listener is registered BEFORE buildAuthenticatedSidebar()."
    );
} else {
    console.log(
        "Unable to establish listener registration ordering."
    );
}

console.log("");
console.log("=== REDIRECT OWNERSHIP ===");

console.log(
    `cooperative-admin.js login redirect count: ${
        (files.cooperativeAdmin.match(
            /window\.location\.href\s*=\s*["']login\.html["']/g
        ) || []).length
    }`
);

console.log(
    `sidebar.js login redirect count: ${
        (files.sidebar.match(
            /window\.location\.href\s*=\s*["']login\.html["']/g
        ) || []).length
    }`
);

console.log("");
console.log("=== AUTH SHARED INSTANCE CHECK ===");

console.log(
    files.cooperativeAdmin.includes(
        'import { auth, db } from "./firebase-config.js";'
    )
        ? "cooperative-admin.js uses shared firebase-config auth: YES"
        : "cooperative-admin.js uses shared firebase-config auth: NO"
);

console.log(
    files.sidebar.includes(
        'import { auth, db } from "../firebase-config.js";'
    )
        ? "sidebar.js uses shared firebase-config auth: YES"
        : "sidebar.js uses shared firebase-config auth: NO"
);

console.log("");
console.log("=== AUDIT DECISION ===");
console.log("No patch applied.");
console.log("No Firebase deployment.");
console.log(
    "RC297D-E22 traces listener registration and redirect ownership only."
);
console.log(
    "================================================"
);
console.log("RC297D-E22 — AUDIT COMPLETE");
console.log("NO PATCH APPLIED");
console.log("NO FIREBASE DEPLOYMENT");
console.log("================================================");
