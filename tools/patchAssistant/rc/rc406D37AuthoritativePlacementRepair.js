import { transaction } from "../patchEngine.js";

const misplacedValidation = `    if (typeof status !== "string") {
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

const createFunctionBoundary = `export async function createDrawGroup(
    groupData
) {
`;

const updateFunctionBoundary = `export async function updateGroupStatus(
    groupId,
    status
) {
`;

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

        search: `${createFunctionBoundary}${misplacedValidation}`,

        replace: createFunctionBoundary
    },
    {
        path: "js/services/drawGroupService.js",

        search: updateFunctionBoundary,

        replace: `${updateFunctionBoundary}${validationBlock}`
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D37 — AUTHORITATIVE VALIDATION PLACEMENT REPAIR");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");

if (!result || result.success === false) {
    console.log("RC406-D37 REPAIR FAILED — TRANSACTION ROLLED BACK");
    process.exitCode = 1;
} else {
    console.log("RC406-D37 REPAIR COMPLETE");
}
