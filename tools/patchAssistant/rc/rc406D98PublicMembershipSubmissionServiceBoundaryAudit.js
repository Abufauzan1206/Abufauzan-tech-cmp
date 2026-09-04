import fs from "fs";

const targetPath =
    "js/services/membershipApplicationService.js";

const source =
    fs.readFileSync(targetPath, "utf8");

let failed = false;

function pass(label) {
    console.log(`PASS: ${label}`);
}

function fail(label) {
    console.error(`FAIL: ${label}`);
    failed = true;
}

if (
    source.includes("httpsCallable") &&
    source.includes("submitMembershipApplication")
) {
    pass("service uses callable submission boundary");
} else {
    fail("service callable submission boundary missing");
}

if (
    source.includes("submitMembershipApplicationCallable") &&
    source.includes("await submitMembershipApplicationCallable(data)")
) {
    pass("service delegates submitted data to callable");
} else {
    fail("service callable delegation missing");
}

if (
    source.includes("result?.data?.success") &&
    source.includes("result.data")
) {
    pass("service validates callable response");
} else {
    fail("service callable response validation missing");
}

if (
    !source.includes("addDoc") &&
    !source.includes("setDoc") &&
    !source.includes("updateDoc") &&
    !source.includes("deleteDoc") &&
    !source.includes("getDocs") &&
    !source.includes("collection(")
) {
    pass("service has no direct Firestore write/read bypass");
} else {
    fail("service contains direct Firestore access");
}

if (
    source.includes("export async function submitMembershipApplication")
) {
    pass("public submission service export exists");
} else {
    fail("public submission service export missing");
}

if (failed) {
    console.error(
        "RC406-D98 PUBLIC MEMBERSHIP SUBMISSION SERVICE BOUNDARY AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D98 PUBLIC MEMBERSHIP SUBMISSION SERVICE BOUNDARY AUDIT: PASS"
);
