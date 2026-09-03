import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "functions/index.js",
        search: `exports.submitMembershipApplication = onCall(async (request) => {`,
        replace: `/**
 * RC406-D68
 *
 * Cooperative Admin membership application retrieval boundary.
 *
 * The caller must be an authenticated Cooperative Admin.
 * The cooperativeId is derived from the authenticated user's
 * Firestore profile and is never accepted from the client as
 * an authorization input.
 */
exports.getPendingMembershipApplications = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be signed in to view membership applications."
    );
  }

  const callerUid = request.auth.uid;

  const userRef =
    db.collection("users").doc(callerUid);

  const userSnap =
    await userRef.get();

  if (!userSnap.exists) {
    throw new HttpsError(
      "permission-denied",
      "Administrator profile not found."
    );
  }

  const userData =
    userSnap.data();

  if (userData.role !== "cooperative_admin") {
    throw new HttpsError(
      "permission-denied",
      "Only a Cooperative Admin can view membership applications."
    );
  }

  const cooperativeId =
    typeof userData.cooperativeId === "string"
      ? userData.cooperativeId.trim()
      : "";

  if (!cooperativeId) {
    throw new HttpsError(
      "permission-denied",
      "Cooperative ownership is not configured for this administrator."
    );
  }

  const snapshot =
    await db
      .collection("membershipApplications")
      .where("cooperativeId", "==", cooperativeId)
      .where("status", "==", "pending")
      .get();

  const applications = [];

  snapshot.forEach((document) => {
    const data = document.data();

    applications.push({
      applicationId:
        typeof data.applicationId === "string"
          ? data.applicationId.trim()
          : document.id,
      cooperativeId,
      firstName:
        typeof data.firstName === "string"
          ? data.firstName.trim()
          : "",
      ...(typeof data.middleName === "string" && data.middleName.trim()
        ? { middleName: data.middleName.trim() }
        : {}),
      lastName:
        typeof data.lastName === "string"
          ? data.lastName.trim()
          : "",
      phone:
        typeof data.phone === "string"
          ? data.phone.trim()
          : "",
      ...(typeof data.email === "string" && data.email.trim()
        ? { email: data.email.trim().toLowerCase() }
        : {}),
      status: "pending",
      submittedAt: data.submittedAt ?? null
    });
  });

  return {
    success: true,
    applications
  };
});

exports.submitMembershipApplication = onCall(async (request) => {`
    }
];

const result = await transaction(patches);

console.log("RC406-D68 PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D68 COOPERATIVE ADMIN MEMBERSHIP APPLICATION RETRIEVAL: FAIL"
    );
}

console.log(
    "RC406-D68 COOPERATIVE ADMIN MEMBERSHIP APPLICATION RETRIEVAL: PASS"
);
