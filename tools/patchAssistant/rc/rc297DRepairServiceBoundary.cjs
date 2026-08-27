const fs = require("fs");

const runnerPath =
  "tools/patchAssistant/rc/rc297DCooperativeApplicationServerBoundary.cjs";

let runner = fs.readFileSync(runnerPath, "utf8");

const oldBlock = `const serviceEnd = service.indexOf(
  "\\n}",
  serviceStart
);`;

const newBlock = `const serviceReturnMarker =
  "return cooperativeId;";

const serviceReturnIndex =
  service.indexOf(serviceReturnMarker, serviceStart);

if (serviceReturnIndex === -1) {
  fail("createCooperative return boundary was not found.");
}

const serviceEnd = service.indexOf(
  "\\n}",
  serviceReturnIndex
);`;

if (!runner.includes(oldBlock)) {
  console.error("FAIL: RC297D service boundary block not found.");
  process.exit(1);
}

runner = runner.replace(oldBlock, newBlock);

fs.writeFileSync(runnerPath, runner);

console.log("RC297D SERVICE BOUNDARY REPAIR APPLIED");
console.log("PASS: service matcher now locates function closing brace after return");
console.log("PASS: service.js was not modified");
console.log("PASS: Firebase targets were not modified");
