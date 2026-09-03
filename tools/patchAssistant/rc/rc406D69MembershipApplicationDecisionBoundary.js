import { patch } from "../patchEngine.js";

const result = await patch({
  path: "functions/index.js",
  mode: "exact",
  search: `exports.submitMembershipApplication = onCall(async (request) => {`,
  replace: `/**
 * RC406-D69
 *
 * Cooperative Admin membership application decision boundary.
 *
 * ACCEPT:
 *   pending application -> active member + approved application
 *
 * REJECT:
 *   pending application -> rejected application
 *
 * Authorization is derived from the authenticated user's
 * Firestore profile. The client cannot supply cooperative
 * ownership as an authorization authority.
 */

async function getCooperativeAdminDecisionContext(request) {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be signed in to manage membership applications."
    );
  }

  const callerUid = request.auth.uid;

  const userSnapshot =
    await db.collection("users").doc(callerUid).get();

  if (!userSnapshot.exists) {
    throw new HttpsError(
      "permission-denied",
      "Administrator profile not found."
    );
  }

  const userData = userSnapshot.data();

  if (userData.role !== "cooperative_admin") {
    throw new HttpsError(
      "permission-denied",
      "Only a Cooperative Admin can manage membership applications."
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

  return {
    callerUid,
    cooperativeId,
  };
}

function normalizeApplicationId(data) {
  return typeof data?.applicationId === "string"
    ? data.applicationId.trim()
    : "";
}

function generateMemberId() {
  const year = new Date().getFullYear();
  const randomPart = crypto
    .randomInt(0, 1000000)
    .toString()
    .padStart(6, "0");

  return \`ATC-MEM-\${year}-\${randomPart}\`;
}

exports.approveMembershipApplication = onCall(async (request) => {
  const { callerUid, cooperativeId } =
    await getCooperativeAdminDecisionContext(request);

  const applicationId =
    normalizeApplicationId(request?.data);

  if (!applicationId) {
    throw new HttpsError(
      "invalid-argument",
      "Membership application ID is required."
    );
  }

  const applicationRef =
    db.collection("membershipApplications").doc(applicationId);

  const memberId = generateMemberId();

  const memberRef =
    db.collection("members").doc(memberId);

  try {
    await db.runTransaction(async (transaction) => {
      const applicationSnapshot =
        await transaction.get(applicationRef);

      if (!applicationSnapshot.exists) {
        throw new HttpsError(
          "not-found",
          "Membership application was not found."
        );
      }

      const application =
        applicationSnapshot.data();

      if (application.cooperativeId !== cooperativeId) {
        throw new HttpsError(
          "permission-denied",
          "This application does not belong to your cooperative."
        );
      }

      if (application.status !== "pending") {
        throw new HttpsError(
          "failed-precondition",
          "Only pending membership applications can be approved."
        );
      }

      const firstName =
        typeof application.firstName === "string"
          ? application.firstName.trim()
          : "";

      const middleName =
        typeof application.middleName === "string"
          ? application.middleName.trim()
          : "";

      const lastName =
        typeof application.lastName === "string"
          ? application.lastName.trim()
          : "";

      const phone =
        typeof application.phone === "string"
          ? application.phone.trim()
          : "";

      const email =
        typeof application.email === "string"
          ? application.email.trim().toLowerCase()
          : "";

      if (!firstName || !lastName || !phone) {
        throw new HttpsError(
          "failed-precondition",
          "Membership application is missing required member identity data."
        );
      }

      const memberData = {
        memberId,
        cooperativeId,
        firstName,
        ...(middleName ? { middleName } : {}),
        lastName,
        phone,
        ...(email ? { email } : {}),
        status: "active",
        createdAt: FieldValue.serverTimestamp(),
      };

      transaction.create(memberRef, memberData);

      transaction.update(applicationRef, {
        status: "approved",
        approvedAt: FieldValue.serverTimestamp(),
        approvedBy: callerUid,
        memberId,
      });
    });
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    logger.error("Membership application approval failed", {
      applicationId,
      cooperativeId,
      callerUid,
      error: error?.message || String(error),
    });

    throw new HttpsError(
      "internal",
      "Unable to approve membership application."
    );
  }

  logger.info("Membership application approved", {
    applicationId,
    cooperativeId,
    memberId,
    approvedBy: callerUid,
  });

  return {
    success: true,
    applicationId,
    memberId,
    status: "approved",
  };
});

exports.rejectMembershipApplication = onCall(async (request) => {
  const { callerUid, cooperativeId } =
    await getCooperativeAdminDecisionContext(request);

  const applicationId =
    normalizeApplicationId(request?.data);

  if (!applicationId) {
    throw new HttpsError(
      "invalid-argument",
      "Membership application ID is required."
    );
  }

  const applicationRef =
    db.collection("membershipApplications").doc(applicationId);

  try {
    await db.runTransaction(async (transaction) => {
      const applicationSnapshot =
        await transaction.get(applicationRef);

      if (!applicationSnapshot.exists) {
        throw new HttpsError(
          "not-found",
          "Membership application was not found."
        );
      }

      const application =
        applicationSnapshot.data();

      if (application.cooperativeId !== cooperativeId) {
        throw new HttpsError(
          "permission-denied",
          "This application does not belong to your cooperative."
        );
      }

      if (application.status !== "pending") {
        throw new HttpsError(
          "failed-precondition",
          "Only pending membership applications can be rejected."
        );
      }

      transaction.update(applicationRef, {
        status: "rejected",
        rejectedAt: FieldValue.serverTimestamp(),
        rejectedBy: callerUid,
      });
    });
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    logger.error("Membership application rejection failed", {
      applicationId,
      cooperativeId,
      callerUid,
      error: error?.message || String(error),
    });

    throw new HttpsError(
      "internal",
      "Unable to reject membership application."
    );
  }

  logger.info("Membership application rejected", {
    applicationId,
    cooperativeId,
    rejectedBy: callerUid,
  });

  return {
    success: true,
    applicationId,
    status: "rejected",
  };
});

exports.submitMembershipApplication = onCall(async (request) => {`
});

console.log(
  "RC406-D69 PATCH ENGINE RESULT:",
  JSON.stringify(result, null, 2)
);

if (!result.success) {
  process.exitCode = 1;
}
