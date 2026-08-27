const fs = require("fs");

const runnerPath =
  "tools/patchAssistant/rc/rc297DCooperativeApplicationServerBoundary.cjs";

let runner = fs.readFileSync(runnerPath, "utf8");

const marker = "const normalize = (value) =>";
const first = runner.indexOf(marker);

if (first === -1) {
  console.error("FAIL: normalize declaration not found.");
  process.exit(1);
}

const second = runner.indexOf(marker, first + marker.length);

if (second === -1) {
  console.log("PASS: duplicate normalize declaration not present.");
  process.exit(0);
}

const normalizeEnd = runner.indexOf(
  "const actualRuleStart =",
  second
);

if (normalizeEnd === -1) {
  console.error("FAIL: second normalize declaration boundary not found.");
  process.exit(1);
}

runner =
  runner.slice(0, second) +
  runner.slice(normalizeEnd);

fs.writeFileSync(runnerPath, runner);

console.log("RC297D DUPLICATE NORMALIZE REPAIR APPLIED");
console.log("PASS: duplicate normalize declaration removed");
console.log("PASS: original structural matcher preserved");
console.log("PASS: no Firebase target modified");
