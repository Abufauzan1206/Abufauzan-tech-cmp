import { transaction } from "../patchEngine.js";

const target =
  "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js";

const patches = [
  {
    path: target,
    mode: "regex",
    search:
      `return \\(\\s*source\\.includes\\("RC190 MEMBER REGISTRATION END-TO-END"\\) \\|\\|\\s*source\\.includes\\('fullName: "RC190 Test Member"'\\) \\|\\|\\s*source\\.includes\\('phoneNumber: "08000000190"'\\)\\s*\\);`,
    replace:
`return (
        source.includes("RC201 — MEMBER REGISTRATION PERSISTENCE VERIFICATION") ||
        source.includes("RC201 MEMBER REGISTRATION PERSISTENCE")
    );`
  }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC219 — REPAIR STALE RC190 TARGET CONTRACT");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
  console.log("RC219 TARGET CONTRACT REPAIR: FAIL");
  process.exitCode = 1;
} else {
  console.log("RC219 TARGET CONTRACT REPAIR: PASS");
}

console.log("==================================================");
