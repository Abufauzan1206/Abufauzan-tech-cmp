import { transaction } from "../patchEngine.js";

const patches = [
  {
    path: "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js",
    mode: "exact",
    search: String.raw`if (\n        relative.startsWith("tools/patchAssistant/") &&\n        relative !== "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js"\n    ) {\n        return false;\n    }`,
    replace: `if (
        relative.startsWith("tools/patchAssistant/") &&
        relative !== "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js"
    ) {
        return false;
    }`
  }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC219 — REPAIR EXACT SCOPE SYNTAX");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
  console.log("RC219 EXACT SCOPE SYNTAX REPAIR: FAIL");
  process.exitCode = 1;
} else {
  console.log("RC219 EXACT SCOPE SYNTAX REPAIR: PASS");
}

console.log("==================================================");
