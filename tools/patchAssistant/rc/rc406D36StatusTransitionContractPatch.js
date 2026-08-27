import fs from "fs/promises";

const path = "js/services/drawGroupService.js";
const source = await fs.readFile(path, "utf8");

const oldStatusBlock = `        {
            status
        }`;

const newStatusBlock = `        {
            status: status
        }`;

const oldUnauthorizedMessage =
    `"Only authorized administrators can update draw group status."`;

const newUnauthorizedMessage =
    `"Unauthorized: only authorized administrators can update draw group status."`;

if (!source.includes(oldStatusBlock)) {
    throw new Error(
        "RC406-D36 PATCH ABORTED — expected status update block not found"
    );
}

if (!source.includes(oldUnauthorizedMessage)) {
    throw new Error(
        "RC406-D36 PATCH ABORTED — expected unauthorized message not found"
    );
}

const updated = source
    .replace(oldStatusBlock, newStatusBlock)
    .replace(oldUnauthorizedMessage, newUnauthorizedMessage);

await fs.writeFile(path, updated, "utf8");

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D36 — STATUS TRANSITION CONTRACT PATCH");
console.log("===============================================");
console.log("PASS — status field made explicit");
console.log("PASS — unauthorized contract marker added");
console.log("===============================================");
console.log("RC406-D36 PATCH COMPLETE");
console.log("===============================================");
