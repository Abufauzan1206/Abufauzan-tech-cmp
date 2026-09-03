import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "functions/index.js",
        search: `exports.submitCooperativeApplication = onCall(async (request) => {`,
        replace: `/**
 * RC406-D65
 *
 * Public cooperative discovery boundary.
 *
 * Only cooperatives that have already been approved and are
 * currently active are exposed. The response intentionally
 * contains only the fields required by the public membership
 * application selector.
 */
exports.getActiveCooperatives = onCall(async () => {
  const snapshot = await db
    .collection("cooperatives")
    .where("status", "==", "active")
    .get();

  const cooperatives = [];

  snapshot.forEach((document) => {
    const data = document.data();

    if (
      typeof data.cooperativeId !== "string" ||
      typeof data.cooperativeName !== "string"
    ) {
      return;
    }

    cooperatives.push({
      cooperativeId: data.cooperativeId.trim(),
      cooperativeName: data.cooperativeName.trim(),
    });
  });

  return {
    success: true,
    cooperatives,
  };
});

exports.submitCooperativeApplication = onCall(async (request) => {`
    }
];

const result = await transaction(patches);

console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D65 BACKEND COOPERATIVE DISCOVERY: FAIL"
    );
}

console.log(
    "RC406-D65 BACKEND COOPERATIVE DISCOVERY: PASS"
);
