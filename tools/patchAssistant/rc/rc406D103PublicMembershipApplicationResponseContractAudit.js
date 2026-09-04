import fs from "fs";

const backend =
    fs.readFileSync("functions/index.js", "utf8");

const service =
    fs.readFileSync("js/services/membershipApplicationService.js", "utf8");

const ui =
    fs.readFileSync("modules/membership-application/app.js", "utf8");

let failed = false;

function pass(label) {
    console.log(`PASS: ${label}`);
}

function fail(label) {
    console.error(`FAIL: ${label}`);
    failed = true;
}

const exportMarker =
    "exports.submitMembershipApplication =";

const exportStart =
    backend.indexOf(exportMarker);

if (exportStart === -1) {
    fail("submitMembershipApplication backend export missing");
} else {
    pass("submitMembershipApplication backend export exists");

    const nextExport =
        backend.indexOf(
            "\nexports.",
            exportStart + exportMarker.length
        );

    const block =
        backend.slice(
            exportStart,
            nextExport === -1 ? backend.length : nextExport
        );

    if (
        block.includes("success: true") &&
        block.includes("applicationId")
    ) {
        pass("backend returns successful application identity");
    } else {
        fail("backend successful application identity response missing");
    }

    if (
        block.includes("applicationId") &&
        block.includes("return")
    ) {
        pass("backend response contains applicationId");
    } else {
        fail("backend applicationId response boundary missing");
    }
}

if (
    service.includes("result.data") &&
    service.includes("return result.data")
) {
    pass("service preserves backend response contract");
} else {
    fail("service response preservation contract missing");
}

if (
    ui.includes("result?.applicationId") ||
    ui.includes("result.applicationId")
) {
    pass("UI consumes returned applicationId");
} else {
    fail("UI applicationId consumption missing");
}

if (
    ui.includes("Application ID:")
) {
    pass("UI exposes returned application identity to applicant");
} else {
    fail("UI application identity presentation missing");
}

if (
    service.includes("result?.data?.success")
) {
    pass("service validates successful backend response");
} else {
    fail("service success validation missing");
}

if (
    ui.includes("catch (error)") &&
    ui.includes("error?.message")
) {
    pass("UI handles failed submission responses");
} else {
    fail("UI failed-response handling missing");
}

if (failed) {
    console.error(
        "RC406-D103 PUBLIC MEMBERSHIP APPLICATION RESPONSE CONTRACT AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D103 PUBLIC MEMBERSHIP APPLICATION RESPONSE CONTRACT AUDIT: PASS"
);
