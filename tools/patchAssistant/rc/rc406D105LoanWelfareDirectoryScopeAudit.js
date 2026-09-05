import fs from "fs";

const loanPath = "js/services/loanService.js";
const welfarePath = "js/services/welfareService.js";
const accessPath = "js/controllers/accessController.js";

let failed = false;

function pass(message) {
    console.log(`PASS: ${message}`);
}

function fail(message) {
    console.log(`FAIL: ${message}`);
    failed = true;
}

function read(path) {
    return fs.readFileSync(path, "utf8");
}

const loan = read(loanPath);
const welfare = read(welfarePath);
const access = read(accessPath);

const centralProfileImport =
    'import { getAuthenticatedProfile } from "../controllers/accessController.js";';

if (access.includes("export async function getAuthenticatedProfile()")) {
    pass("central authenticated profile authority exists");
} else {
    fail("central authenticated profile authority is missing");
}

/* ----------------------------------------------------
 * LOAN SERVICE
 * -------------------------------------------------- */

if (loan.includes(centralProfileImport)) {
    pass("loan service imports central profile authority");
} else {
    fail("loan service does not import central profile authority");
}

if (loan.includes(
    "const session = await getAuthenticatedProfile();"
)) {
    pass("loan directory retrieval uses authenticated profile");
} else {
    fail("loan directory retrieval does not use authenticated profile");
}

if (
    loan.includes('role === "cooperative_admin"') &&
    loan.includes('role === "cooperativeAdmin"')
) {
    pass("loan retrieval explicitly recognizes cooperative-admin roles");
} else {
    fail("loan retrieval lacks cooperative-admin role gate");
}

if (
    loan.includes("session.profile?.cooperativeId") &&
    loan.includes('"cooperativeId"')
) {
    pass("loan retrieval derives cooperative ownership from profile");
} else {
    fail("loan retrieval lacks cooperative ownership derivation");
}

if (
    loan.includes('collection(db, "loans"),') &&
    loan.includes('"cooperativeId",')
) {
    pass("loan retrieval contains cooperative-scoped Firestore query");
} else {
    fail("loan retrieval lacks cooperative-scoped Firestore query");
}

if (
    loan.includes("snapshot = await getDocs(q);")
) {
    pass("loan retrieval executes the scoped query");
} else {
    fail("loan retrieval does not execute the scoped query");
}

if (
    loan.includes(
        "Cooperative administrator profile has no cooperativeId."
    )
) {
    pass("loan retrieval rejects missing cooperative ownership");
} else {
    fail("loan retrieval does not reject missing cooperative ownership");
}

/* ----------------------------------------------------
 * WELFARE SERVICE
 * -------------------------------------------------- */

if (welfare.includes(centralProfileImport)) {
    pass("welfare service imports central profile authority");
} else {
    fail("welfare service does not import central profile authority");
}

if (welfare.includes(
    "const session = await getAuthenticatedProfile();"
)) {
    pass("welfare directory retrieval uses authenticated profile");
} else {
    fail("welfare directory retrieval does not use authenticated profile");
}

if (
    welfare.includes('role === "cooperative_admin"') &&
    welfare.includes('role === "cooperativeAdmin"')
) {
    pass("welfare retrieval explicitly recognizes cooperative-admin roles");
} else {
    fail("welfare retrieval lacks cooperative-admin role gate");
}

if (
    welfare.includes("session.profile?.cooperativeId") &&
    welfare.includes('"cooperativeId"')
) {
    pass("welfare retrieval derives cooperative ownership from profile");
} else {
    fail("welfare retrieval lacks cooperative ownership derivation");
}

if (
    welfare.includes('collection(db, "welfare"),') &&
    welfare.includes('"cooperativeId",')
) {
    pass("welfare retrieval contains cooperative-scoped Firestore query");
} else {
    fail("welfare retrieval lacks cooperative-scoped Firestore query");
}

if (
    welfare.includes("snapshot = await getDocs(q);")
) {
    pass("welfare retrieval executes the scoped query");
} else {
    fail("welfare retrieval does not execute the scoped query");
}

if (
    welfare.includes(
        "Cooperative administrator profile has no cooperativeId."
    )
) {
    pass("welfare retrieval rejects missing cooperative ownership");
} else {
    fail("welfare retrieval does not reject missing cooperative ownership");
}

/* ----------------------------------------------------
 * DIRECTORY CONSUMERS
 * -------------------------------------------------- */

const loanDirectory =
    read("modules/loans/loan-directory/script.js");

const welfareDirectory =
    read("modules/welfare/welfare-directory/script.js");

if (loanDirectory.includes("getLoans")) {
    pass("loan directory consumes centralized loan retrieval service");
} else {
    fail("loan directory does not consume centralized loan retrieval service");
}

if (welfareDirectory.includes("getWelfareRequests")) {
    pass("welfare directory consumes centralized welfare retrieval service");
} else {
    fail("welfare directory does not consume centralized welfare retrieval service");
}

console.log(
    "RC406-D105 LOAN/WELFARE DIRECTORY SCOPE AUDIT: " +
    (failed ? "FAIL" : "PASS")
);

if (failed) {
    process.exit(1);
}
