import fs from "fs";

const files = [
  "js/auth.js",
  "js/components/auth.js",
  "js/components/roleAuthorization.js",
  "js/super-admin.js",
  "js/cooperative-admin.js",
  "modules/member-portal/member-portal.js",
  "js/navigation/sidebar.js",
  "js/core/app.js",
  "js/core/frameworkInitializer.js",
  "js/core/serviceRegistry.js",
  "js/core/sessionService.js",
  "js/core/organizationService.js",
  "js/core/permissionService.js"
];

const patterns = [
  "signInWithEmailAndPassword",
  "onAuthStateChanged",
  "window.location.href",
  "window.location.replace",
  "window.location.assign",
  "location.href",
  "location.replace",
  "super-admin.html",
  "cooperative-admin.html",
  "modules/member-portal/index.html",
  "requireLogin",
  "currentUser",
  "getDoc",
  'doc(db, "users"',
  "rolesMatch",
  "normalizeRole",
  "setRole",
  "setPermissions",
  "CMPAuth",
  "CentralAccessController",
  "AccessController",
  "routeAfterLogin",
  "redirect"
];

console.log("==================================================");
console.log("RC406-D21");
console.log("CENTRAL ACCESS CONTROLLER");
console.log("AUTHORITY / ROUTING / REDIRECT TRACE");
console.log("NO PATCH / INSPECTION ONLY");
console.log("==================================================");

let failures = 0;

for (const path of files) {
  console.log(`\n--- ${path} ---`);

  if (!fs.existsSync(path)) {
    console.log("ABSENT");
    continue;
  }

  const source = fs.readFileSync(path, "utf8");
  const lines = source.split(/\r?\n/);

  for (const pattern of patterns) {
    const matches = [];

    lines.forEach((line, index) => {
      if (line.includes(pattern)) {
        matches.push(`${index + 1}: ${line.trim()}`);
      }
    });

    if (matches.length) {
      console.log(`FOUND | ${pattern} | count=${matches.length}`);
      for (const match of matches.slice(0, 12)) {
        console.log(`  ${match}`);
      }
      if (matches.length > 12) {
        console.log(`  ... ${matches.length - 12} additional match(es)`);
      }
    }
  }
}

console.log("\n==================================================");
console.log("RC406-D21 DECISION");
console.log("==================================================");

const authSource = fs.existsSync("js/auth.js")
  ? fs.readFileSync("js/auth.js", "utf8")
  : "";

const hasDirectLoginRouting =
  authSource.includes("signInWithEmailAndPassword") &&
  (
    authSource.includes("super-admin.html") ||
    authSource.includes("cooperative-admin.html") ||
    authSource.includes("modules/member-portal/index.html")
  );

const hasCentralController =
  files.some(path => {
    if (!fs.existsSync(path)) return false;
    const source = fs.readFileSync(path, "utf8");
    return /CentralAccessController|AccessController|routeAfterLogin/.test(source);
  });

if (hasDirectLoginRouting) {
  console.log("FINDING: js/auth.js currently owns both authentication and dashboard routing.");
}

if (!hasCentralController) {
  console.log("FINDING: No explicit Central Access Controller authority was found in the inspected core files.");
}

console.log(
  hasDirectLoginRouting && !hasCentralController
    ? "DECISION: CENTRAL ACCESS CONTROL IS NOT YET CENTRALIZED."
    : "DECISION: CENTRAL ACCESS CONTROLLER REQUIRES FURTHER CORRELATION."
);

console.log("==================================================");
