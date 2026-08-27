import { transaction } from "../patchEngine.js";

const target =
    "tools/patchAssistant/rc/rc213AlignRC211CooperativeOwnershipContract.js";

const patches = [
    {
        path: target,
        mode: "text",
        search: `console.log("RC213 — ALIGN RC211 COOPERATIVE OWNERSHIP CONTRACT");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log(
        "RC213 ALIGN RC211 COOPERATIVE OWNERSHIP CONTRACT: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC213 ALIGN RC211 COOPERATIVE OWNERSHIP CONTRACT: PASS"
    );
}

console.log("==================================================");`,
        replace: ""
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC213 — REPAIR DUPLICATE FOOTER");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log("RC213 DUPLICATE FOOTER REPAIR: FAIL");
    process.exitCode = 1;
} else {
    console.log("RC213 DUPLICATE FOOTER REPAIR: PASS");
}

console.log("==================================================");
