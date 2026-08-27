import { transaction } from "../patchEngine.js";

const validationBlock = `    if (typeof status !== "string") {
        throw new Error(
            "Invalid draw group status."
        );
    }

    if (status.trim().length === 0) {
        throw new Error(
            "Invalid draw group status."
        );
    }

    const validDrawGroupStatuses = [
        "Draft"
    ];

    if (
        !validDrawGroupStatuses.includes(
            status.trim()
        )
    ) {
        throw new Error(
            "Invalid draw group status."
        );
    }

    status = status.trim();

`;

const patches = [
    {
        path: "js/services/drawGroupService.js",

        search: `) {
    if (typeof status !== "string") {`,

        replace: `) {`
    },

    {
        path: "js/services/drawGroupService.js",

        search: `    status = status.trim();
    const profile =
        await getCurrentUserProfile();`,

        replace: `    const profile =
        await getCurrentUserProfile();`
    },

    {
        path: "js/services/drawGroupService.js",

        search: `export async function updateGroupStatus(
    groupId,
    status
) {
    const profile =
        await getCurrentUserProfile();`,

        replace: `export async function updateGroupStatus(
    groupId,
    status
) {
${validationBlock}    const profile =
        await getCurrentUserProfile();`
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D37 — VALIDATION PLACEMENT REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");
console.log("RC406-D37 REPAIR COMPLETE");
console.log("===============================================");

if (!result || result.success === false) {
    process.exitCode = 1;
}
