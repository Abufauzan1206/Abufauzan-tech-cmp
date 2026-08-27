import { transaction } from "../patchEngine.js";

const target =
  "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js";

const patches = [
  {
    path: target,
    mode: "regex",
    search:
      'if \\(\\s*relative\\.startsWith\\("tools/patchAssistant/"\\) \\|\\|\\s*relative === "tools/patchAssistant/rc/rc219ActivateMemberTestTarget\\.js"\\s*\\) \\{\\s*return false;\\s*\\}',
    replace:
      'if (\\n' +
      '        relative.startsWith("tools/patchAssistant/") &&\\n' +
      '        relative !== "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js"\\n' +
      '    ) {\\n' +
      '        return false;\\n' +
      '    }'
  }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC219 — REPAIR AUTHORITATIVE TARGET SCOPE");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
  console.log("RC219 AUTHORITATIVE TARGET SCOPE: FAIL");
  process.exitCode = 1;
} else {
  console.log("RC219 AUTHORITATIVE TARGET SCOPE: PASS");
}

console.log("==================================================");
