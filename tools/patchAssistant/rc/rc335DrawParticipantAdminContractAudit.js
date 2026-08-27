import fs from "fs";

const callerFile =
    "modules/contribution-draw/group-participants/script.js";

const authFile = "js/auth.js";
const adminFile = "js/cooperative-admin.js";
const superAdminFile = "js/super-admin.js";
const roleFile =
    "js/components/roleAuthorization.js";

console.log("===============================================");
console.log("RC335 DRAW PARTICIPANT ADMIN CONTRACT AUDIT");
console.log("===============================================");

const files = [
    callerFile,
    authFile,
    adminFile,
    superAdminFile,
    roleFile
];

console.log("");
console.log("----- FILE AVAILABILITY -----");

for (const file of files) {
    console.log(
        `${file}: ${fs.existsSync(file) ? "PRESENT" : "ABSENT"}`
    );
}

const caller = fs.readFileSync(callerFile, "utf8");
const auth = fs.existsSync(authFile)
    ? fs.readFileSync(authFile, "utf8")
    : "";

const admin = fs.existsSync(adminFile)
    ? fs.readFileSync(adminFile, "utf8")
    : "";

const superAdmin = fs.existsSync(superAdminFile)
    ? fs.readFileSync(superAdminFile, "utf8")
    : "";

const role = fs.existsSync(roleFile)
    ? fs.readFileSync(roleFile, "utf8")
    : "";

console.log("");
console.log("----- EXISTING ROLE CONTRACT -----");

for (const signal of [
    "rolesMatch",
    "super_admin",
    "cooperative_admin",
    "member"
]) {
    console.log(
        `${signal}: ${
            role.includes(signal) ||
            auth.includes(signal) ||
            admin.includes(signal) ||
            superAdmin.includes(signal)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- ADMIN SESSION CONTRACT -----");

for (const signal of [
    "onAuthStateChanged",
    "auth.currentUser",
    'doc(db, "users", user.uid)',
    "rolesMatch"
]) {
    console.log(
        `${signal}: ${
            admin.includes(signal) ||
            superAdmin.includes(signal)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- GROUP-PARTICIPANT CALLER CONTRACT -----");

for (const signal of [
    "groupId",
    "memberId",
    "addParticipantToGroup",
    "createDrawBox",
    "getMembers",
    "getDrawGroupById"
]) {
    console.log(
        `${signal}: ${
            caller.includes(signal)
                ? "PRESENT"
                : "ABSENT"
        }`
    );
}

console.log("");
console.log("----- CALLER AUTHORIZATION -----");

const callerAuth =
    /auth\.currentUser|onAuthStateChanged|rolesMatch|requireAuth|requireRole|super_admin|cooperative_admin/.test(
        caller
    );

console.log(
    `CALLER AUTHORIZATION SIGNAL: ${
        callerAuth ? "PRESENT" : "ABSENT"
    }`
);

console.log("");
console.log("----- EXISTING ADMIN AUTHORIZATION CONTRACT -----");

const hasCooperativeAdminContract =
    /rolesMatch[\s\S]*?cooperative_admin/.test(admin);

const hasSuperAdminContract =
    /rolesMatch[\s\S]*?super_admin/.test(superAdmin);

console.log(
    `COOPERATIVE ADMIN CONTRACT: ${
        hasCooperativeAdminContract
            ? "PRESENT"
            : "ABSENT"
    }`
);

console.log(
    `SUPER ADMIN CONTRACT: ${
        hasSuperAdminContract
            ? "PRESENT"
            : "ABSENT"
    }`
);

console.log("");
console.log("----- RC335 DECISION -----");

if (
    !callerAuth &&
    (hasCooperativeAdminContract || hasSuperAdminContract)
) {
    console.log(
        "RC335 FINDING: GROUP-PARTICIPANT PAGE DOES NOT CARRY ITS OWN AUTHORIZATION, BUT EXISTING ADMIN AUTHORIZATION CONTRACT IS AVAILABLE."
    );

    console.log(
        "RC335 STATUS: REUSE EXISTING ADMIN ROLE CONTRACT."
    );

    console.log(
        "RC335 NEXT: DETERMINE THE CORRECT ADMIN ENTRY/GUARD PATH BEFORE PATCHING THE SERVICE."
    );
} else {
    console.log(
        "RC335 FINDING: ADMIN AUTHORIZATION CONTRACT REQUIRES FURTHER REVIEW."
    );

    console.log(
        "RC335 STATUS: DO NOT PATCH SERVICE CONTRACT YET."
    );
}

console.log("");
console.log("===============================================");
console.log("RC335 AUDIT COMPLETE");
console.log("===============================================");
console.log("RC335: NO FILES MODIFIED");
