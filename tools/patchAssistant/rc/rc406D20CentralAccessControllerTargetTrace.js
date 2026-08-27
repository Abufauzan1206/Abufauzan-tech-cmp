import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const targets = [
  "js/core/app.js",
  "js/core/frameworkInitializer.js",
  "js/core/serviceRegistry.js",
  "js/core/sessionService.js",
  "js/core/permissionService.js",
  "js/core/organizationService.js",
  "js/components/auth.js",
  "js/components/roleAuthorization.js",
  "js/auth.js",
  "js/cooperative-admin.js",
  "js/super-admin.js",
  "modules/member-portal/member-portal.js",
  "js/adapters/firebaseAdapter.js"
];

function read(rel) {
  const file = path.join(ROOT, rel);

  if (!fs.existsSync(file)) {
    console.log(`MISSING: ${rel}`);
    return null;
  }

  return fs.readFileSync(file, "utf8");
}

function section(title) {
  console.log("\n==================================================");
  console.log(title);
  console.log("==================================================");
}

function trace(rel, source, patterns) {
  console.log(`\n--- ${rel} ---`);

  for (const pattern of patterns) {
    const lines = source
      .split("\n")
      .map((line, index) => ({ line, number: index + 1 }))
      .filter(x => x.line.includes(pattern));

    if (!lines.length) {
      console.log(`ABSENT | ${pattern}`);
      continue;
    }

    console.log(`FOUND | ${pattern} | count=${lines.length}`);

    for (const item of lines) {
      console.log(`${item.number}: ${item.line.trim()}`);
    }
  }
}

console.log("==================================================");
console.log("RC406-DISCOVERY-20");
console.log("CENTRAL ACCESS CONTROLLER");
console.log("AUTHORITATIVE TARGET / CONTRACT TRACE");
console.log("NO PATCH / INSPECTION ONLY");
console.log("==================================================");

section("A. CORE BOOTSTRAP OWNERSHIP");

for (const rel of [
  "js/core/app.js",
  "js/core/frameworkInitializer.js",
  "js/core/serviceRegistry.js"
]) {
  const source = read(rel);

  if (!source) continue;

  trace(rel, source, [
    "import",
    "initialize",
    "CMPFrameworkInitializer",
    "CMPServiceRegistry",
    "CMP.init",
    "loadFramework",
    "register("
  ]);
}

section("B. FIREBASE AUTHORITY AVAILABLE TO CORE");

for (const rel of [
  "js/adapters/firebaseAdapter.js",
  "js/components/auth.js",
  "js/auth.js"
]) {
  const source = read(rel);

  if (!source) continue;

  trace(rel, source, [
    "firebase",
    "getAuth",
    "auth",
    "onAuthStateChanged",
    "onIdTokenChanged",
    "currentUser",
    "signInWithEmailAndPassword",
    "signOut"
  ]);
}

section("C. CMP AUTH STATE CONTRACT");

{
  const rel = "js/components/auth.js";
  const source = read(rel);

  if (source) {
    trace(rel, source, [
      "class CMPAuth",
      "currentUser",
      "onChange",
      "setRole",
      "setPermissions",
      "getRole",
      "hasPermission",
      "logout",
      "requireLogin",
      "hasRole",
      "isSuperAdmin",
      "isCooperativeAdmin",
      "isMember",
      "normalizeRole",
      "rolesMatch",
      "role",
      "permissions"
    ]);
  }
}

section("D. SESSION CONTRACT");

{
  const rel = "js/core/sessionService.js";
  const source = read(rel);

  if (source) {
    trace(rel, source, [
      "class CMPSessionService",
      "static session",
      "start(",
      "get(",
      "touch(",
      "getDuration(",
      "hasSession(",
      "end("
    ]);
  }
}

section("E. ORGANIZATION CONTRACT");

{
  const rel = "js/core/organizationService.js";
  const source = read(rel);

  if (source) {
    trace(rel, source, [
      "class CMPOrganizationService",
      "organization",
      "set(",
      "get(",
      "hasOrganization(",
      "clear("
    ]);
  }
}

section("F. PERMISSION CONTRACT");

{
  const rel = "js/core/permissionService.js";
  const source = read(rel);

  if (source) {
    trace(rel, source, [
      "class CMPPermissionService",
      "permissions",
      "set(",
      "get(",
      "has(",
      "clear("
    ]);
  }
}

section("G. AUTHORITATIVE PROFILE / ROLE RESOLUTION");

for (const rel of [
  "js/auth.js",
  "js/components/auth.js",
  "js/cooperative-admin.js",
  "js/super-admin.js",
  "modules/member-portal/member-portal.js"
]) {
  const source = read(rel);

  if (!source) continue;

  trace(rel, source, [
    'doc(db, "users"',
    "getDoc(",
    "userData.role",
    "profile.role",
    "normalizeRole",
    "rolesMatch",
    "cooperativeId",
    "organizationId",
    "permissions"
  ]);
}

section("H. DASHBOARD ROUTING OWNERS");

for (const rel of [
  "js/auth.js",
  "js/components/auth.js",
  "js/cooperative-admin.js",
  "js/super-admin.js",
  "modules/member-portal/member-portal.js"
]) {
  const source = read(rel);

  if (!source) continue;

  trace(rel, source, [
    "super-admin.html",
    "cooperative-admin.html",
    "modules/member-portal/index.html",
    "window.location",
    "location.href",
    "location.replace"
  ]);
}

section("I. SERVICE REGISTRY INITIALIZATION ORDER");

{
  const rel = "js/core/serviceRegistry.js";
  const source = read(rel);

  if (source) {
    const lines = source.split("\n");

    lines.forEach((line, index) => {
      if (
        line.includes("this.register(") ||
        line.includes("CMPAuth") ||
        line.includes("CMPOrganizationService") ||
        line.includes("CMPPermissionService") ||
        line.includes("CMPSessionService") ||
        line.includes("static initialize")
      ) {
        console.log(`${index + 1}: ${line.trim()}`);
      }
    });
  }
}

section("J. TARGET DECISION SIGNALS");

const framework = read("js/core/frameworkInitializer.js");
const app = read("js/core/app.js");
const auth = read("js/components/auth.js");

console.log(
  `FRAMEWORK_INITIALIZER_EXISTS: ${framework ? "YES" : "NO"}`
);

console.log(
  `APP_BOOTSTRAP_EXISTS: ${app ? "YES" : "NO"}`
);

console.log(
  `CMP_AUTH_EXISTS: ${auth ? "YES" : "NO"}`
);

console.log(
  `CENTRAL_CONTROLLER_CLASS_ALREADY_PRESENT: ${
    targets.some(rel => {
      const source = read(rel);
      return source &&
        /CentralAccessController|AccessController|AuthenticationController/.test(source);
    })
      ? "YES"
      : "NO"
  }`
);

console.log("\n==================================================");
console.log("RC406-DISCOVERY-20 COMPLETE");
console.log("NO PATCH APPLIED");
console.log("NEXT: AUTHORITATIVE TARGET DECISION");
console.log("==================================================");
