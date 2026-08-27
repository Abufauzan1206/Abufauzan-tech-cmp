const fs = require("fs");

const runnerPath =
  "tools/patchAssistant/rc/rc297DCooperativeApplicationServerBoundary.cjs";

let runner = fs.readFileSync(runnerPath, "utf8");

const oldBlock = `const expectedRuleBlock =
\`match /cooperatives/{cooperativeId} {
      allow read: if isSuperAdmin()
        || belongsToCooperative(cooperativeId);
      allow create: if true;
      allow update: if isSuperAdmin();
      allow delete: if isSuperAdmin();
    }\`;

if (!rules.includes(expectedRuleBlock)) {
  fail("Cooperative rule block differs from the audited RC297B structure.");
}`;

const newBlock = `const expectedRuleRegex =
/match\\\\s+\\\\/cooperatives\\\\/\\\\{cooperativeId\\\\}\\\\s*\\\\{\\\\s*` +
`allow read:\\\\s*if isSuperAdmin\\\\(\\\\)\\\\s*` +
`\\\\|\\\\| belongsToCooperative\\\\(cooperativeId\\\\);\\\\s*` +
`allow create:\\\\s*if true;\\\\s*` +
`allow update:\\\\s*if isSuperAdmin\\\\(\\\\);\\\\s*` +
`allow delete:\\\\s*if isSuperAdmin\\\\(\\\\);\\\\s*\\\\}/;

if (!expectedRuleRegex.test(rules)) {
  fail("Audited cooperative rule structure was not found.");
}`;

if (!runner.includes(oldBlock)) {
  console.error("FAIL: RC297D runner matcher block not found.");
  process.exit(1);
}

runner = runner.replace(oldBlock, newBlock);

fs.writeFileSync(runnerPath, runner);

console.log("RC297D MATCHER REPAIR APPLIED");
console.log("PASS: cooperative rule matching is now whitespace-tolerant");
console.log("PASS: no project Firebase target was modified by this repair");
