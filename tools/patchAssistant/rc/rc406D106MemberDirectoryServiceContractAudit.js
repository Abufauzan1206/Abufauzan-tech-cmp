import fs from "fs";

const directoryPath =
    "modules/members/member-directory/script.js";

const servicePath =
    "js/services/memberService.js";

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

const directory = read(directoryPath);
const service = read(servicePath);

/* ----------------------------------------------------
 * SERVICE CONTRACT
 * -------------------------------------------------- */

if (
    service.includes(
        "export async function getAllMembers()"
    )
) {
    pass(
        "member service exports getAllMembers"
    );
} else {
    fail(
        "member service does not export getAllMembers"
    );
}

/* ----------------------------------------------------
 * DIRECTORY IMPORT
 * -------------------------------------------------- */

if (
    directory.includes(
        'import { getAllMembers } from "../../../js/services/memberService.js";'
    )
) {
    pass(
        "member directory imports the canonical member retrieval service"
    );
} else {
    fail(
        "member directory does not import getAllMembers"
    );
}

if (
    !directory.includes(
        'import { getMembers } from "../../../js/services/memberService.js";'
    )
) {
    pass(
        "member directory no longer imports nonexistent getMembers"
    );
} else {
    fail(
        "member directory still imports nonexistent getMembers"
    );
}

/* ----------------------------------------------------
 * DIRECTORY CONSUMPTION
 * -------------------------------------------------- */

if (
    directory.includes(
        "const members = await getAllMembers();"
    )
) {
    pass(
        "member directory calls getAllMembers"
    );
} else {
    fail(
        "member directory does not call getAllMembers"
    );
}

if (
    !directory.includes(
        "const members = await getMembers();"
    )
) {
    pass(
        "member directory no longer calls nonexistent getMembers"
    );
} else {
    fail(
        "member directory still calls nonexistent getMembers"
    );
}

/* ----------------------------------------------------
 * SYNTAX
 * -------------------------------------------------- */

console.log(
    "RC406-D106 MEMBER DIRECTORY SERVICE CONTRACT AUDIT: " +
    (failed ? "FAIL" : "PASS")
);

if (failed) {
    process.exit(1);
}
