const fs = require("fs");

const runnerPath =
  "tools/patchAssistant/rc/rc297DCooperativeApplicationServerBoundary.cjs";

let runner = fs.readFileSync(runnerPath, "utf8");

const marker = "const normalize = (value) =>";

const first = runner.indexOf(marker);
const second = runner.indexOf(marker, first + marker.length);

if (first === -1) {
  console.error("FAIL: first normalize declaration not found.");
  process.exit(1);
}

if (second === -1) {
  console.log("PASS: duplicate normalize declaration not present.");
  process.exit(0);
}

const duplicateEndMarker =
  'value.replace(/\\s+/g, " ").trim();';

const duplicateEnd = runner.indexOf(
  duplicateEndMarker,
  second
);

if (duplicateEnd === -1) {
  console.error("FAIL: duplicate normalize body not found.");
  process.exit(1);
}

const removeEnd = duplicateEnd + duplicateEndMarker.length;

runner =
  runner.slice(0, second) +
  runner.slice(removeEnd);

fs.writeFileSync(runnerPath, runner);

console.log("RC297D DUPLICATE NORMALIZE REPAIR 2 APPLIED");
console.log("PASS: second normalize declaration removed");
console.log("PASS: first normalize declaration preserved");
console.log("PASS: no Firebase target modified");
