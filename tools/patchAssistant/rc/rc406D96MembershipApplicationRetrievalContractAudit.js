import fs from "fs";

const targetPath = "functions/index.js";
const source = fs.readFileSync(targetPath, "utf8");

let failed = false;

function pass(label) {
  console.log(`PASS: ${label}`);
}

function fail(label) {
  console.error(`FAIL: ${label}`);
  failed = true;
}

const exportMarker =
  "exports.getPendingMembershipApplications = onCall(async (request) => {";

const exportCount =
  (source.match(
    /^exports\.getPendingMembershipApplications\s*=/gm
  ) || []).length;

if (exportCount === 1) {
  pass("exactly one getPendingMembershipApplications export");
} else {
  fail(
    `expected exactly one getPendingMembershipApplications export; found ${exportCount}`
  );
}

const exportStart = source.indexOf(exportMarker);
if (exportStart === -1) {
  fail("retrieval export exists");
} else {
  const nextExport = source.indexOf("\nexports.", exportStart + exportMarker.length);
  const blockEnd = nextExport === -1 ? source.length : nextExport;
  const block = source.slice(exportStart, blockEnd);

  if (block.includes('if (!request.auth)')) {
    pass("authentication boundary present");
  } else {
    fail("authentication boundary missing");
  }

  if (block.includes('userData.role !== "cooperative_admin"')) {
    pass("cooperative admin role enforcement present");
  } else {
    fail("cooperative admin role enforcement missing");
  }

  if (block.includes('userData.cooperativeId')) {
    pass("cooperative ownership derived from authenticated profile");
  } else {
    fail("cooperative ownership derivation missing");
  }

  if (
    block.includes('.where("cooperativeId", "==", cooperativeId)') &&
    block.includes('.where("status", "==", "pending")')
  ) {
    pass("retrieval query is scoped by cooperativeId and pending status");
  } else {
    fail("retrieval query scope is incomplete");
  }

  if (block.includes("return {") && block.includes("applications")) {
    pass("sanitized application response returned");
  } else {
    fail("application response contract missing");
  }

  if (
    !block.includes("request.data.cooperativeId") &&
    !block.includes("data.cooperativeId")
  ) {
    pass("client cooperativeId is not used as retrieval authority");
  } else {
    fail("client-supplied cooperativeId appears to influence retrieval authority");
  }
}

if (failed) {
  console.error(
    "RC406-D96 MEMBERSHIP APPLICATION RETRIEVAL CONTRACT AUDIT: FAIL"
  );
  process.exit(1);
}

console.log(
  "RC406-D96 MEMBERSHIP APPLICATION RETRIEVAL CONTRACT AUDIT: PASS"
);
