import fs from "fs";

console.log("================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC297D-E23 — AUTH CALLBACK REDIRECT RACE / DECISION TRACE");
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
    auth: fs.readFileSync(
        "js/auth.js",
        "utf8"
    )
};

function linesContaining(text, patterns) {
    return text
        .split("\n")
        .map((line, index) => ({
            line: index + 1,
            text: line
        }))
        .filter(({ text }) =>
            patterns.some(pattern => pattern.test(text))
        );
}

console.log("\n=== COOPERATIVE ADMIN CALLBACK DECISION POINTS ===");

for (const item of linesContaining(files.cooperativeAdmin, [
    /onAuthStateChanged/,
    /if\s*\(!user\)/,
    /getDoc/,
    /userDoc\.exists/,
    /rolesMatch/,
    /allowed/,
    /window\.location\.href/,
    /signOut/
])) {
    console.log(
        `${String(item.line).padStart(4, " ")}  ${item.text}`
    );
}

console.log("\n=== SIDEBAR CALLBACK DECISION POINTS ===");

for (const item of linesContaining(files.sidebar, [
    /onAuthStateChanged/,
    /if\s*\(!user\)/,
    /getDoc/,
    /userDoc\.exists/,
    /rolesMatch/,
    /window\.location\.href/,
    /buildSidebar/
])) {
    console.log(
        `${String(item.line).padStart(4, " ")}  ${item.text}`
    );
}

console.log("\n=== AUTH.JS INITIAL REDIRECT DECISION ===");

for (const item of linesContaining(files.auth, [
    /signInWithEmailAndPassword/,
    /getDoc/,
    /rolesMatch/,
    /window\.location\.href/
])) {
    console.log(
        `${String(item.line).padStart(4, " ")}  ${item.text}`
    );
}

const cooperativeAdminRedirects =
    (files.cooperativeAdmin.match(/window\.location\.href/g) || []).length;

const sidebarRedirects =
    (files.sidebar.match(/window\.location\.href/g) || []).length;

const cooperativeAdminAuthListeners =
    (files.cooperativeAdmin.match(/onAuthStateChanged\s*\(/g) || []).length;

const sidebarAuthListeners =
    (files.sidebar.match(/onAuthStateChanged\s*\(/g) || []).length;

console.log("\n=== CALLBACK / REDIRECT INVENTORY ===");

console.log(
    `cooperative-admin.js auth listeners: ${cooperativeAdminAuthListeners}`
);

console.log(
    `sidebar.js auth listeners: ${sidebarAuthListeners}`
);

console.log(
    `cooperative-admin.js location redirects: ${cooperativeAdminRedirects}`
);

console.log(
    `sidebar.js location redirects: ${sidebarRedirects}`
);

console.log("\n=== RACE CONDITION INDICATORS ===");

console.log(
    files.cooperativeAdmin.includes(
        'buildAuthenticatedSidebar("sidebarMenu");'
    )
        ? "sidebar initialization precedes cooperative-admin auth listener: YES"
        : "sidebar initialization precedes cooperative-admin auth listener: NO"
);

console.log(
    files.cooperativeAdmin.includes(
        'onAuthStateChanged(auth, async (user) => {'
    )
        ? "cooperative-admin owns an independent auth callback: YES"
        : "cooperative-admin owns an independent auth callback: NO"
);

console.log(
    files.sidebar.includes(
        "onAuthStateChanged(auth, async user => {"
    )
        ? "sidebar owns an independent auth callback: YES"
        : "sidebar owns an independent auth callback: NO"
);

console.log(
    files.cooperativeAdmin.includes(
        'window.location.href = "login.html";'
    )
        ? "cooperative-admin can redirect unauthenticated/invalid session: YES"
        : "cooperative-admin can redirect unauthenticated/invalid session: NO"
);

console.log(
    files.sidebar.includes(
        'window.location.href = "login.html";'
    )
        ? "sidebar can redirect unauthenticated/invalid session: YES"
        : "sidebar can redirect unauthenticated/invalid session: NO"
);

console.log("\n=== AUDIT DECISION ===");
console.log("No patch applied.");
console.log("No Firebase deployment.");
console.log(
    "RC297D-E23 traces callback-level competing decisions before any ownership consolidation."
);
console.log(
    "================================================"
);
console.log("RC297D-E23 — AUDIT COMPLETE");
console.log("NO PATCH APPLIED");
console.log("NO FIREBASE DEPLOYMENT");
console.log("================================================");
