const fs = require("fs");

const runnerPath =
  "tools/patchAssistant/rc/rc297DCooperativeApplicationServerBoundary.cjs";

let runner = fs.readFileSync(runnerPath, "utf8");

const start = runner.indexOf("const expectedRuleRegex =");
const end = runner.indexOf(
  'const oldServicePattern =',
  start
);

if (start === -1 || end === -1) {
  console.error("FAIL: RC297D matcher section could not be located.");
  process.exit(1);
}

const replacement = `const expectedRuleBlock =
\`match /cooperatives/{cooperativeId} {
  allow read: if isSuperAdmin()
    || belongsToCooperative(cooperativeId);
  allow create: if true;
  allow update: if isSuperAdmin();
  allow delete: if isSuperAdmin();
}\`;

const normalize = (value) =>
  value.replace(/\\\\s+/g, " ").trim();

const actualRuleStart =
  rules.indexOf("match /cooperatives/{cooperativeId}");

if (actualRuleStart === -1) {
  fail("Cooperative rule block was not found.");
}

const actualRuleEnd =
  rules.indexOf("\\n    }", actualRuleStart);

if (actualRuleEnd === -1) {
  fail("Cooperative rule closing boundary was not found.");
}

const actualRuleBlock =
  rules.slice(actualRuleStart, actualRuleEnd + 6);

if (normalize(actualRuleBlock) !== normalize(expectedRuleBlock)) {
  fail("Audited cooperative rule structure was not found.");
}

`;

runner =
  runner.slice(0, start) +
  replacement +
  runner.slice(end);

fs.writeFileSync(runnerPath, runner);

console.log("RC297D MATCHER REPAIR 2 APPLIED");
console.log("PASS: regex matcher removed");
console.log("PASS: whitespace-normalized structural matcher installed");
console.log("PASS: no Firebase target modified");
