const fs = require("fs");

const runnerPath =
  "tools/patchAssistant/rc/rc297DCooperativeApplicationServerBoundary.cjs";

let runner = fs.readFileSync(runnerPath, "utf8");

const bad = 'value.replace(/\\\\s+/g, " ").trim();';
const good = 'value.replace(/\\s+/g, " ").trim();';

if (!runner.includes(bad)) {
  console.error("FAIL: expected escaped whitespace matcher was not found.");
  process.exit(1);
}

runner = runner.replace(bad, good);

fs.writeFileSync(runnerPath, runner);

console.log("RC297D MATCHER REPAIR 3 APPLIED");
console.log("PASS: whitespace regex corrected");
console.log("PASS: no Firebase target modified");
