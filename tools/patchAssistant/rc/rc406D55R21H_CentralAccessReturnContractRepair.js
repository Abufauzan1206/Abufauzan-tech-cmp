import { transaction } from "../patchEngine.js";

const superAdminReturnOld = `        return {
            allowed: true,
            role: "super_admin",
            automatic: true,
            destination: "super-admin.html"
        };`;

const superAdminReturnNew = `        return {
            allowed: true,
            role: "super_admin",
            automatic: true,
            destination: "super-admin.html",
            uid: session.uid,
            user: session.user,
            profile: session.profile
        };`;

const dashboardReturnOld = `    return {
        allowed: true,
        role: actualRole,
        automatic: false,
        destination
    };`;

const dashboardReturnNew = `    return {
        allowed: true,
        role: actualRole,
        automatic: false,
        destination,
        uid: session.uid,
        user: session.user,
        profile: session.profile
    };`;

const patches = [
    {
        path: "js/controllers/accessController.js",
        search: superAdminReturnOld,
        replace: superAdminReturnNew
    },
    {
        path: "js/controllers/accessController.js",
        search: dashboardReturnOld,
        replace: dashboardReturnNew
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D55R21-H — CENTRAL ACCESS RETURN CONTRACT REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log(
        "RC406-D55R21-H REPAIR FAILED — TRANSACTION ROLLED BACK"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D55R21-H REPAIR COMPLETE"
    );
}
