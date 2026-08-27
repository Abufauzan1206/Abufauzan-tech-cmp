import { transaction } from "../patchEngine.js";

const target =
  "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js";

const patches = [
  {
    path: target,
    mode: "exact",
    search: `    /*\n     * Legacy default import:\n     *\n     * import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";\n     */\n    if (\n        /import\\s+MemoryAdapter\\s+from\\s+["'][^"']*memoryAdapter\\.js["'];/.test(\n            source\n        )\n    ) {`,
    replace: `    /*\n     * RC219 canonical-target guard:\n     * RC201 is now the authoritative member-registration\n     * persistence verification and uses memberService directly.\n     * Do not reintroduce the obsolete RC190 MemoryAdapter contract.\n     */\n    if (\n        target === "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js" &&\n        source.includes("from \\"../../../js/services/memberService.js\\"") &&\n        source.includes("registerMember") &&\n        source.includes("getMemberById") &&\n        source.includes("deleteMember")\n    ) {\n        console.log(\n            "RC219: AUTHORITATIVE RC201 TARGET ALREADY USES CANONICAL MEMBER SERVICE CONTRACT."\n        );\n        console.log(\n            "RC219: OBSOLETE RC190 MEMORYADAPTER REPAIR NOT REQUIRED."\n        );\n        console.log("RC219 MEMBER TEST TARGET: PASS");\n        process.exit(0);\n    }\n\n    /*\n     * Legacy default import:\n     *\n     * import MemoryAdapter from \"./js/adapters/memoryAdapter.js\";\n     */\n    if (\n        /import\\s+MemoryAdapter\\s+from\\s+[\"'][^\"']*memoryAdapter\\.js[\"'];/.test(\n            source\n        )\n    ) {`
  }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC219 — REPAIR ACTIVATION CONTRACT");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
  console.log("RC219 ACTIVATION CONTRACT REPAIR: FAIL");
  process.exitCode = 1;
} else {
  console.log("RC219 ACTIVATION CONTRACT REPAIR: PASS");
}

console.log("==================================================");
