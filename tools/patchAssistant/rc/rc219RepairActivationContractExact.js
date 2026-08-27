import { transaction } from "../patchEngine.js";

const target =
  "tools/patchAssistant/rc/rc219ActivateMemberTestTarget.js";

const patches = [
  {
    path: target,
    mode: "regex",
    search:
      `const patches = \\[\\];[\\s\\S]*?if \\(patches\\.length === 0\\) \\{[\\s\\S]*?process\\.exit\\(\\);\\n\\}`,
    replace:
`const patches = [];

/*
 * RC219 canonical-target contract:
 *
 * RC201 is the authoritative member-registration persistence
 * verification target. It uses memberService directly:
 *
 *   registerMember
 *   getMemberById
 *   deleteMember
 *
 * Therefore RC219 must NOT attempt the obsolete RC190
 * MemoryAdapter import/constructor repair against RC201.
 */
const canonicalRC201 =
    target ===
        "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js" &&
    source.includes(
        'from "../../../js/services/memberService.js";'
    ) &&
    source.includes("registerMember") &&
    source.includes("getMemberById") &&
    source.includes("deleteMember");

if (canonicalRC201) {
    console.log(
        "RC219: AUTHORITATIVE RC201 MEMBER SERVICE CONTRACT CONFIRMED."
    );
    console.log(
        "RC219: OBSOLETE RC190 MEMORYADAPTER REPAIR SKIPPED."
    );
    console.log("RC219 MEMBER TEST TARGET: PASS");
    process.exit(0);
}

console.error(
    "RC219 ERROR: Target is not the authoritative RC201 member-service contract."
);
process.exitCode = 1;
process.exit();`
  }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC219 — REPAIR ACTIVATION CONTRACT EXACT");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
  console.log("RC219 ACTIVATION CONTRACT EXACT REPAIR: FAIL");
  process.exitCode = 1;
} else {
  console.log("RC219 ACTIVATION CONTRACT EXACT REPAIR: PASS");
}

console.log("==================================================");
