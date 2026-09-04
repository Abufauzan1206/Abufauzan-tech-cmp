import fs from "fs";

const uiPath =
    "modules/membership-application/app.js";

const servicePath =
    "js/services/membershipApplicationService.js";

const htmlPath =
    "modules/membership-application/index.html";

const ui =
    fs.readFileSync(uiPath, "utf8");

const service =
    fs.readFileSync(servicePath, "utf8");

const html =
    fs.readFileSync(htmlPath, "utf8");

let failed = false;

function pass(label) {
    console.log(`PASS: ${label}`);
}

function fail(label) {
    console.error(`FAIL: ${label}`);
    failed = true;
}

const requiredFields = [
    "firstName",
    "middleName",
    "lastName",
    "phone",
    "email",
    "cooperativeId"
];

for (const field of requiredFields) {
    if (
        html.includes(`name="${field}"`) &&
        ui.includes(`${field}:`)
    ) {
        pass(`UI handles ${field}`);
    } else {
        fail(`UI field contract missing: ${field}`);
    }
}

if (
    ui.includes("new FormData(form)") &&
    ui.includes("formData.get")
) {
    pass("UI builds payload from submitted form data");
} else {
    fail("UI FormData payload construction missing");
}

if (
    ui.includes(".trim()") &&
    ui.includes("validateApplication(data)")
) {
    pass("UI normalizes and validates submission payload");
} else {
    fail("UI normalization/validation boundary missing");
}

if (
    ui.includes("submitMembershipApplication(data)")
) {
    pass("UI delegates submission to membership service");
} else {
    fail("UI membership service delegation missing");
}

if (
    service.includes(
        "export async function submitMembershipApplication"
    ) &&
    service.includes(
        "submitMembershipApplicationCallable(data)"
    )
) {
    pass("service exposes and delegates public submission");
} else {
    fail("service public submission contract missing");
}

if (
    ui.includes("result?.applicationId") ||
    ui.includes("result.applicationId")
) {
    pass("UI handles successful application response");
} else {
    fail("UI success response handling missing");
}

if (
    ui.includes("catch (error)") &&
    ui.includes("error?.message")
) {
    pass("UI handles submission errors");
} else {
    fail("UI submission error handling missing");
}

if (failed) {
    console.error(
        "RC406-D99 PUBLIC MEMBERSHIP APPLICATION UI-SERVICE CONTRACT AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D99 PUBLIC MEMBERSHIP APPLICATION UI-SERVICE CONTRACT AUDIT: PASS"
);
