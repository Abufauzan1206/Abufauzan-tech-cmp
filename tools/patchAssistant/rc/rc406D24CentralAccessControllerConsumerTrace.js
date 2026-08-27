import fs from "fs";
import path from "path";

console.log("==================================================");
console.log("RC406-D24");
console.log("CENTRAL ACCESS CONTROLLER");
console.log("AUTH.JS CONSUMER / NON-DASHBOARD FLOW TRACE");
console.log("NO PATCH / INSPECTION ONLY");
console.log("==================================================");

const roots = [
  "js",
  "modules",
  "tools/patchAssistant/rc"
];

const extensions = new Set([".js", ".html"]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const results = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (extensions.has(path.extname(entry.name))) {
      results.push(full);
    }
  }

  return results;
}

const files = roots.flatMap(walk);

const patterns = [
  "auth.js",
  "./auth.js",
  "../auth.js",
  "js/auth.js",
  "loginForm",
  "signInWithEmailAndPassword",
  "signOut",
  "onAuthStateChanged",
  "register",
  "password",
  "login.html",
  "register-cooperative",
  "reset"
];

let totalMatches = 0;

for (const file of files) {
  let source;

  try {
    source = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const lines = source.split(/\r?\n/);
  const matches = [];

  for (const pattern of patterns) {
    const regex = new RegExp(
      pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    lines.forEach((line, index) => {
      if (regex.test(line)) {
        matches.push({
          pattern,
          line: index + 1,
          text: line.trim()
        });
      }
    });
  }

  if (matches.length) {
    console.log(`\n--- ${file} ---`);

    const unique = [];
    const seen = new Set();

    for (const match of matches) {
      const key =
        `${match.pattern}|${match.line}|${match.text}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(match);
      }
    }

    for (const match of unique) {
      console.log(
        `FOUND | ${match.pattern} | ${match.line}: ${match.text}`
      );
      totalMatches++;
    }
  }
}

console.log("\n==================================================");
console.log("RC406-D24 REQUIRED DETERMINATION");
console.log("==================================================");
console.log(`TOTAL MATCHES: ${totalMatches}`);
console.log("");
console.log("Determine:");
console.log("1. Whether js/auth.js is consumed outside the login entry point.");
console.log("2. Whether js/auth.js contains non-dashboard authentication flows.");
console.log("3. Whether replacing its post-login routing would break");
console.log("   registration, password reset, logout, or other flows.");
console.log("4. Whether login authentication itself should remain in js/auth.js");
console.log("   while routing is delegated to CentralAccessController.");
console.log("5. Whether any existing page already imports a central auth service.");
console.log("6. The safest migration boundary for establishing one routing authority.");
console.log("==================================================");
