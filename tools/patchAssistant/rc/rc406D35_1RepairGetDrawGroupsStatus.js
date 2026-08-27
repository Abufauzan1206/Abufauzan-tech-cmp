import fs from "fs/promises";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const oldBlock = `export async function getDrawGroups() {
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
        await getCurrentUserProfile();`;

const newBlock = `export async function getDrawGroups() {
    const profile =
        await getCurrentUserProfile();`;

if (!source.includes(oldBlock)) {
    throw new Error(
        "RC406-D35.1 PATCH ABORTED — exact getDrawGroups status-validation block not found."
    );
}

const occurrences = source.split(oldBlock).length - 1;

if (occurrences !== 1) {
    throw new Error(
        "RC406-D35.1 PATCH ABORTED — expected exactly 1 target, found " +
        occurrences +
        "."
    );
}

const updated = source.replace(oldBlock, newBlock);

await fs.writeFile(path, updated, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D35.1 — GET DRAW GROUPS STATUS VALIDATION REPAIR");
console.log("===============================================");
console.log("PASS — exact obsolete status-validation block located");
console.log("PASS — exactly one authoritative target confirmed");
console.log("PASS — status validation removed from parameterless list operation");
console.log("PASS — getCurrentUserProfile remains authoritative");
console.log("===============================================");
console.log("RC406-D35.1 COMPLETE");
console.log("===============================================");
