import { patch } from "../patchEngine.js";

const result = await patch({
    path: "js/services/membershipApplicationService.js",
    mode: "exact",
    search: `export async function getMembershipApplications() {
    return await CMPMembershipApplicationEngine.getAll();
}`,
    replace: `export async function getMembershipApplications() {
    return await CMPMembershipApplicationEngine.getAll();
}

/**
 * Retrieve membership applications belonging to one cooperative.
 */
export async function getMembershipApplicationsByCooperativeId(
    cooperativeId
) {
    return await CMPMembershipApplicationEngine
        .getByCooperativeId(cooperativeId);
}`
});

console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exit(1);
}

console.log(
    "RC406-D62 MEMBERSHIP APPLICATION SERVICE COOPERATIVE QUERY: PASS"
);
