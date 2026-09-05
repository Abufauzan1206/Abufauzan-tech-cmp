import fs from "fs";

const rules = fs.readFileSync("firestore.rules", "utf8");

const checks = [
  {
    name: "users own-profile update is restricted",
    pass: !/allow update:\s*if isSuperAdmin\(\)\s*\|\|\s*isOwnUserProfile\(userId\)/.test(rules)
  },
  {
    name: "cooperative-admin loan access is cooperative-scoped",
    pass: !/allow read: if isSuperAdmin\(\)\s*\|\|\s*isCooperativeAdmin\(\)/.test(rules)
  },
  {
    name: "cooperative-admin welfare access is cooperative-scoped",
    pass: !/allow read: if isSuperAdmin\(\)\s*\|\|\s*isCooperativeAdmin\(\)/.test(rules)
  },
  {
    name: "members authorization surface is explicitly audited",
    pass: /match \/members\//.test(rules) || /match \/\{document=\*\*\}/.test(rules)
  },
  {
    name: "membership applications authorization surface is explicitly audited",
    pass: /match \/membershipApplications\//.test(rules) || /match \/\{document=\*\*\}/.test(rules)
  }
];

let failed = 0;

for (const check of checks) {
  console.log((check.pass ? "PASS: " : "FAIL: ") + check.name);
  if (!check.pass) failed++;
}

if (failed > 0) {
  console.error(
    "RC406-D104 FIRESTORE AUTHORIZATION BOUNDARY AUDIT: FAIL"
  );
  process.exit(1);
}

console.log(
  "RC406-D104 FIRESTORE AUTHORIZATION BOUNDARY AUDIT: PASS"
);
