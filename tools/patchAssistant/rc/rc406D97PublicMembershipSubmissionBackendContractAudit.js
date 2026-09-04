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
    "exports.submitMembershipApplication = onCall(async (request) => {";

const exportCount =
    (source.match(/^exports\.submitMembershipApplication\s*=/gm) || []).length;

if (exportCount === 1) {
    pass("exactly one submitMembershipApplication export");
} else {
    fail(
        `expected exactly one submitMembershipApplication export; found ${exportCount}`
    );
}

const exportStart = source.indexOf(exportMarker);

if (exportStart === -1) {
    fail("submission export exists");
} else {
    const nextExport =
        source.indexOf("\nexports.", exportStart + exportMarker.length);

    const blockEnd =
        nextExport === -1 ? source.length : nextExport;

    const block =
        source.slice(exportStart, blockEnd);

    if (
        block.includes("request.data") ||
        block.includes("request?.data")
    ) {
        pass("callable receives request data");
    } else {
        fail("callable request data boundary missing");
    }

    if (
        block.includes("firstName") &&
        block.includes("lastName") &&
        block.includes("phone") &&
        block.includes("cooperativeId")
    ) {
        pass("required membership identity fields are handled");
    } else {
        fail("required membership identity fields are incomplete");
    }

    if (
        block.includes("cooperatives") &&
        block.includes('status !== "active"')
    ) {
        pass("selected cooperative active-status validation present");
    } else {
        fail("selected cooperative active-status validation missing");
    }

    if (
        block.includes("membershipApplications") &&
        block.includes('status: "pending"')
    ) {
        pass("membership application persists as pending");
    } else {
        fail("pending membership application persistence contract missing");
    }

    if (block.includes("serverTimestamp")) {
        pass("server submission timestamp present");
    } else {
        fail("server submission timestamp missing");
    }

    if (
        !block.includes("request.auth") &&
        !block.includes("userData.role")
    ) {
        pass("public submission does not require authenticated user role");
    } else {
        fail("public submission appears to require authenticated user role");
    }
}

if (failed) {
    console.error(
        "RC406-D97 PUBLIC MEMBERSHIP SUBMISSION BACKEND CONTRACT AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D97 PUBLIC MEMBERSHIP SUBMISSION BACKEND CONTRACT AUDIT: PASS"
);
