import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "functions/index.js",
        search: `exports.getActiveCooperatives = onCall(async () => {`,
        replace: `exports.getActiveCooperatives = onCall(async () => {`
    },
    {
        path: "functions/index.js",
        search: `exports.submitCooperativeApplication = onCall(async (request) => {`,
        replace: `/**
 * RC406-D66
 *
 * Public membership application submission boundary.
 *
 * This callable accepts an unauthenticated membership application,
 * verifies that the selected cooperative is active, and stores the
 * application as pending. It does not create an active member.
 */
exports.submitMembershipApplication = onCall(async (request) => {
  const data = request?.data || {};

  const firstName =
    typeof data.firstName === "string"
      ? data.firstName.trim()
      : "";

  const middleName =
    typeof data.middleName === "string"
      ? data.middleName.trim()
      : "";

  const lastName =
    typeof data.lastName === "string"
      ? data.lastName.trim()
      : "";

  const phone =
    typeof data.phone === "string"
      ? data.phone.trim()
      : "";

  const email =
    typeof data.email === "string"
      ? data.email.trim().toLowerCase()
      : "";

  const cooperativeId =
    typeof data.cooperativeId === "string"
      ? data.cooperativeId.trim()
      : "";

  if (!firstName) {
    throw new HttpsError(
      "invalid-argument",
      "First name is required."
    );
  }

  if (!lastName) {
    throw new HttpsError(
      "invalid-argument",
      "Last name is required."
    );
  }

  if (!phone) {
    throw new HttpsError(
      "invalid-argument",
      "Phone number is required."
    );
  }

  if (!cooperativeId) {
    throw new HttpsError(
      "invalid-argument",
      "Cooperative ID is required."
    );
  }

  const cooperativeRef =
    db.collection("cooperatives").doc(cooperativeId);

  const cooperativeSnapshot =
    await cooperativeRef.get();

  if (!cooperativeSnapshot.exists) {
    throw new HttpsError(
      "not-found",
      "Selected cooperative was not found."
    );
  }

  const cooperative =
    cooperativeSnapshot.data();

  if (cooperative?.status !== "active") {
    throw new HttpsError(
      "failed-precondition",
      "Selected cooperative is not accepting membership applications."
    );
  }

  const applicationRef =
    db.collection("membershipApplications").doc();

  const applicationId =
    applicationRef.id;

  await applicationRef.set({
    applicationId,
    cooperativeId,
    firstName,
    ...(middleName ? { middleName } : {}),
    lastName,
    phone,
    ...(email ? { email } : {}),
    status: "pending",
    submittedAt: FieldValue.serverTimestamp()
  });

  return {
    success: true,
    applicationId
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
        "RC406-D66 PUBLIC MEMBERSHIP SUBMISSION: FAIL"
    );
}

console.log(
    "RC406-D66 PUBLIC MEMBERSHIP SUBMISSION: PASS"
);
