import fs from "fs";

console.log("==================================================");
console.log("RC406-D23");
console.log("CENTRAL ACCESS CONTROLLER");
console.log("STATE / SERVICE / INITIALIZATION TRACE");
console.log("NO PATCH / INSPECTION ONLY");
console.log("==================================================");

const targets = [
  "js/components/auth.js",
  "js/components/roleAuthorization.js",
  "js/core/sessionService.js",
  "js/core/organizationService.js",
  "js/core/permissionService.js",
  "js/core/serviceRegistry.js",
  "js/core/frameworkInitializer.js",
  "js/core/app.js",
  "js/auth.js"
];

const patterns = [
  "CMPAuth",
  "CMPSessionService",
  "CMPOrganizationService",
  "CMPPermissionService",
  "ServiceRegistry",
  "initialize",
  "init",
  "setRole",
  "setPermissions",
  "currentUser",
  "onAuthStateChanged",
  "getDoc",
  "users",
  "organization",
  "permission",
  "session"
];

for (const path of targets) {
  console.log(`\n--- ${path} ---`);

  if (!fs.existsSync(path)) {
    console.log(`MISSING | ${path}`);
    continue;
  }

  const source = fs.readFileSync(path, "utf8");
  const lines = source.split(/\r?\n/);

  let found = false;

  for (const pattern of patterns) {
    const regex = new RegExp(pattern, "i");

    lines.forEach((line, index) => {
      if (regex.test(line)) {
        console.log(
          `FOUND | ${pattern} | ${index + 1}: ${line.trim()}`
        );
        found = true;
      }
    });
  }

  if (!found) {
    console.log("NO TARGET STATE REFERENCES FOUND");
  }
}

console.log("\n==================================================");
console.log("RC406-D23 REQUIRED DETERMINATION");
console.log("==================================================");
console.log("Determine:");
console.log("1. Whether CMPAuth role state is currently initialized.");
console.log("2. Whether permission state is currently initialized.");
console.log("3. Whether session state is currently initialized.");
console.log("4. Whether organization state is currently initialized.");
console.log("5. Whether ServiceRegistry/framework initialization already owns");
console.log("   any of these responsibilities.");
console.log("6. Whether Central Access Controller should initialize state");
console.log("   directly or delegate to existing services.");
console.log("7. Whether non-dashboard authenticated flows depend on js/auth.js.");
console.log("8. The safest authoritative insertion point for centralized routing.");
console.log("==================================================");
