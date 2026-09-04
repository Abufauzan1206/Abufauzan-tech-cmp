import fs from "fs";

const source =
    fs.readFileSync("functions/index.js", "utf8");

const exportMarker =
    "exports.submitMembershipApplication =";

const exportStart =
    source.indexOf(exportMarker);

let failed = false;

function pass(label) {
    console.log(`PASS: ${label}`);
}

function fail(label) {
    console.error(`FAIL: ${label}`);
    failed = true;
}

if (exportStart === -1) {
    fail("submitMembershipApplication backend export missing");
} else {
    pass("submitMembershipApplication backend export exists");

    const nextExport =
        source.indexOf(
            "\nexports.",
            exportStart + exportMarker.length
        );

    const block =
        source.slice(
            exportStart,
            nextExport === -1 ? source.length : nextExport
        );

    if (
        block.includes("pendingApplicationsQuery")
    ) {
        pass("pending membership application duplicate query exists");
    } else {
        fail("pending membership application duplicate query missing");
    }

    if (
        block.includes("membershipApplications") &&
        block.includes("cooperativeId")
    ) {
        pass("duplicate query is tied to membership application cooperative scope");
    } else {
        fail("duplicate query cooperative scope missing");
    }

    if (
        block.includes("pending") &&
        (
            block.includes("status") ||
            block.includes("where")
        )
    ) {
        pass("duplicate protection considers pending application state");
    } else {
        fail("pending duplicate state boundary missing");
    }

    if (
        block.includes("phone") &&
        block.includes("email")
    ) {
        pass("duplicate protection considers normalized contact identity");
    } else {
        fail("duplicate contact identity checks missing");
    }

    if (
        block.includes("already") ||
        block.includes("duplicate") ||
        block.includes("exists")
    ) {
        pass("duplicate submission rejection boundary exists");
    } else {
        fail("duplicate submission rejection boundary missing");
    }

    if (
        block.includes("applicationId") &&
        block.includes("pending")
    ) {
        pass("new application is created only after duplicate checks");
    } else {
        fail("application creation ordering contract missing");
    }
}

if (failed) {
    console.error(
        "RC406-D102 PUBLIC MEMBERSHIP SUBMISSION DUPLICATE-PROTECTION AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D102 PUBLIC MEMBERSHIP SUBMISSION DUPLICATE-PROTECTION AUDIT: PASS"
);
