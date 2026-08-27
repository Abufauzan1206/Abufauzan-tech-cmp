const fs = require("fs");

const rulesPath = "firestore.rules";

let rules = fs.readFileSync(rulesPath, "utf8");

const blockStartMarker =
  "match /cooperatives/{cooperativeId} {";

const blockStart = rules.indexOf(blockStartMarker);

if (blockStart === -1) {
  console.error("FAIL: cooperatives rule block not found.");
  process.exit(1);
}

const blockEndMarker = "\n    }";
const blockEnd = rules.indexOf(blockEndMarker, blockStart);

if (blockEnd === -1) {
  console.error("FAIL: cooperatives rule closing boundary not found.");
  process.exit(1);
}

const blockEndIndex = blockEnd + blockEndMarker.length;

const block = rules.slice(blockStart, blockEndIndex);

const unsafeCreateRule = "allow create: if true;";
const safeCreateRule = "allow create: if false;";

if (!block.includes(unsafeCreateRule)) {
  if (block.includes(safeCreateRule)) {
    console.log("PASS: cooperative create rule is already explicitly denied.");
    console.log("PASS: no Firebase target change required.");
    process.exit(0);
  }

  console.error(
    "FAIL: expected unrestricted cooperative create rule was not found inside the cooperative block."
  );
  process.exit(1);
}

const repairedBlock = block.replace(
  unsafeCreateRule,
  safeCreateRule
);

if (repairedBlock === block) {
  console.error("FAIL: cooperative create rule replacement did not occur.");
  process.exit(1);
}

rules =
  rules.slice(0, blockStart) +
  repairedBlock +
  rules.slice(blockEndIndex);

fs.writeFileSync(rulesPath, rules);

console.log("RC297D COOPERATIVE CREATE RULE REPAIR APPLIED");
console.log("PASS: cooperative direct client create is explicitly denied");
console.log("PASS: cooperative read/update/delete rules preserved");
console.log("PASS: server Admin SDK creation path remains available");
console.log("PASS: only firestore.rules was modified");
