import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/services/drawGroupService.js",

        search: `) {
    const profile =
        await getCurrentUserProfile();`,

        replace: `) {
    if (typeof status !== "string") {
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

    const profile =
        await getCurrentUserProfile();`
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D37 — DRAW GROUP STATUS VALIDATION PATCH");
console.log("===============================================");
console.log(JSON.stringify(result, null, 2));
console.log("===============================================");
console.log("RC406-D37 PATCH COMPLETE");
console.log("===============================================");

if (!result || result.success === false) {
    process.exitCode = 1;
}
