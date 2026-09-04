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
        block.includes('collection("membershipApplications")') ||
        block.includes("collection('membershipApplications')")
    ) {
        pass("membership application collection boundary present");
    } else {
        fail("membership application collection boundary missing");
    }

    if (
        block.includes('status: "pending"') ||
        block.includes("status: 'pending'")
    ) {
        pass("application persists with pending status");
    } else {
        fail("pending application status persistence missing");
    }

    if (
        block.includes("applicationId") &&
        block.includes("cooperativeId")
    ) {
        pass("application and cooperative identity are persisted");
    } else {
        fail("application/cooperative identity persistence missing");
    }

    if (
        block.includes("firstName") &&
        block.includes("lastName") &&
        block.includes("phone")
    ) {
        pass("required member identity fields are persisted");
    } else {
        fail("required member identity persistence missing");
    }

    if (
        block.includes("submittedAt") &&
        (
            block.includes("FieldValue.serverTimestamp()") ||
            block.includes("serverTimestamp()")
        )
    ) {
        pass("server submission timestamp is persisted");
    } else {
        fail("server submission timestamp persistence missing");
    }

    if (
        block.includes('cooperative?.status !== "active"') ||
        block.includes('status !== "active"')
    ) {
        pass("selected cooperative active-status validation remains before persistence");
    } else {
        fail("active cooperative validation boundary missing");
    }

    if (
        block.includes("return {") &&
        block.includes("success: true") &&
        block.includes("applicationId")
    ) {
        pass("successful submission returns application identity");
    } else {
        fail("successful submission response contract missing");
    }
}

if (failed) {
    console.error(
        "RC406-D101 PUBLIC MEMBERSHIP SUBMISSION PERSISTENCE CONTRACT AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D101 PUBLIC MEMBERSHIP SUBMISSION PERSISTENCE CONTRACT AUDIT: PASS"
);
