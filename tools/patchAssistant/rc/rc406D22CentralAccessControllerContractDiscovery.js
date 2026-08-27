import fs from "fs";

const targets = [
  "js/auth.js",
  "js/components/auth.js",
  "js/components/roleAuthorization.js",
  "js/core/sessionService.js",
  "js/core/organizationService.js",
  "js/core/permissionService.js",
  "js/core/serviceRegistry.js",
  "js/navigation/sidebar.js",
  "js/super-admin.js",
  "js/cooperative-admin.js",
  "modules/member-portal/member-portal.js"
];

const requiredSignals = [
  "signInWithEmailAndPassword",
  "getDoc",
  'doc(db, "users"',
  "rolesMatch",
  "normalizeRole",
  "window.location.href",
  "onAuthStateChanged",
  "CMPAuth",
  "setRole",
  "setPermissions",
  "CMPSessionService",
  "CMPOrganizationService",
  "CMPPermissionService"
];

console.log("==================================================");
console.log("RC406-D22");
console.log("CENTRAL ACCESS CONTROLLER");
console.log("CONTRACT / AUTHORITY / STATE DISCOVERY");
console.log("NO PATCH / INSPECTION ONLY");
console.log("==================================================");

const findings = [];

for (const path of targets) {
  console.log(`\n--- ${path} ---`);

  if (!fs.existsSync(path)) {
    console.log("ABSENT");
    continue;
  }

  const source = fs.readFileSync(path, "utf8");
  const lines = source.split(/\r?\n/);

  for (const signal of requiredSignals) {
    const matches = [];

    lines.forEach((line, index) => {
      if (line.includes(signal)) {
        matches.push(`${index + 1}: ${line.trim()}`);
      }
    });

    if (matches.length) {
      console.log(`FOUND | ${signal} | count=${matches.length}`);

      for (const match of matches.slice(0, 8)) {
        console.log(`  ${match}`);
      }

      if (matches.length > 8) {
        console.log(`  ... ${matches.length - 8} additional match(es)`);
      }
    }
  }
}

console.log("\n==================================================");
console.log("RC406-D22 REQUIRED CENTRAL CONTROLLER CONTRACT");
console.log("==================================================");

console.log(`
1. AUTHENTICATION
   - Accept authenticated Firebase user.
   - Do not duplicate Firebase credential validation unnecessarily.

2. PROFILE RESOLUTION
   - Resolve authoritative profile from users/{uid}.
   - Missing profile must fail closed.

3. ROLE RESOLUTION
   - Use roleAuthorization.js.
   - Normalize supported aliases.
   - Do not invent alternate role semantics.

4. DASHBOARD ROUTING
   super_admin        -> super-admin.html
   cooperative_admin  -> cooperative-admin.html
   member             -> modules/member-portal/index.html

5. UNKNOWN ROLE
   - Must not authorize a protected dashboard.
   - Must fail closed.

6. STATE
   - Determine whether CMPAuth role/permissions state,
     session state, organization state and permission state
     must be initialized by the controller.

7. NON-DASHBOARD ACCESS
   - Do not assume every authenticated request is a dashboard request.
   - Preserve legitimate non-dashboard application flows.

8. DASHBOARD DEFENSE
   - Existing dashboard-level authorization guards remain.
   - Central routing does not replace dashboard authorization.

9. SIDEBAR
   - Sidebar role-to-dashboard mapping must not become a
     competing authentication authority.

10. SINGLE ROUTING AUTHORITY
    - Post-login dashboard routing should ultimately have
      one authoritative implementation.
`);

const authSource = fs.existsSync("js/auth.js")
  ? fs.readFileSync("js/auth.js", "utf8")
  : "";

const sidebarSource = fs.existsSync("js/navigation/sidebar.js")
  ? fs.readFileSync("js/navigation/sidebar.js", "utf8")
  : "";

const dashboardSources = [
  "js/super-admin.js",
  "js/cooperative-admin.js",
  "modules/member-portal/member-portal.js"
]
  .filter(fs.existsSync)
  .map(path => fs.readFileSync(path, "utf8"));

const directLoginRouting =
  authSource.includes("signInWithEmailAndPassword") &&
  (
    authSource.includes("super-admin.html") ||
    authSource.includes("cooperative-admin.html") ||
    authSource.includes("modules/member-portal/index.html")
  );

const independentDashboardAuth =
  dashboardSources.some(source =>
    source.includes("onAuthStateChanged") &&
    source.includes('doc(db, "users"')
  );

const competingSidebarRouting =
  sidebarSource.includes("super-admin.html") &&
  sidebarSource.includes("cooperative-admin.html") &&
  sidebarSource.includes("modules/member-portal/index.html");

console.log("\n==================================================");
console.log("RC406-D22 DECISION");
console.log("==================================================");

if (directLoginRouting) {
  findings.push("LOGIN + POST-LOGIN ROUTING ARE COLOCATED IN js/auth.js");
}

if (independentDashboardAuth) {
  findings.push("DASHBOARDS CONTAIN INDEPENDENT AUTHORIZATION GUARDS");
}

if (competingSidebarRouting) {
  findings.push("SIDEBAR CONTAINS A SECOND ROLE-TO-DASHBOARD ROUTING MAP");
}

for (const finding of findings) {
  console.log(`FINDING: ${finding}`);
}

if (
  directLoginRouting &&
  independentDashboardAuth &&
  competingSidebarRouting
) {
  console.log(
    "DECISION: CENTRAL ACCESS CONTROLLER CONTRACT MUST BE ESTABLISHED BEFORE PATCHING."
  );
} else {
  console.log(
    "DECISION: CENTRAL ACCESS CONTROLLER CONTRACT REQUIRES FURTHER CORRELATION."
  );
}

console.log("==================================================");
