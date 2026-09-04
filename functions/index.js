const crypto = require("crypto");
const { setGlobalOptions } = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/https");
const { logger } = require("firebase-functions/logger");

const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();
const auth = getAuth();

setGlobalOptions({
  maxInstances: 10,
});

/**
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

/**
 * RC406-D66
 *
 * Public membership application submission boundary.
 *
 * This callable accepts an unauthenticated membership application,
 * verifies that the selected cooperative is active, and stores the
 * application as pending. It does not create an active member.
 */
/**
 * RC406-D68
 *
 * Cooperative Admin membership application retrieval boundary.
 *
 * The caller must be an authenticated Cooperative Admin.
 * The cooperativeId is derived from the authenticated user's
 * Firestore profile and is never accepted from the client as
 * an authorization input.
 */
/**
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

/**
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

  return `ATC-MEM-${year}-${randomPart}`;
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

      const normalizedPhone =
        phone.trim();

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingMembersSnapshot =
        await transaction.get(
          db
            .collection("members")
            .where(
              "cooperativeId",
              "==",
              cooperativeId
            )
            .where(
              "status",
              "==",
              "active"
            )
        );

      const duplicateActiveMember =
        existingMembersSnapshot.docs.find(
          (document) => {
            const existingMember =
              document.data();

            const existingPhone =
              typeof existingMember.phone === "string"
                ? existingMember.phone.trim()
                : "";

            const existingEmail =
              typeof existingMember.email === "string"
                ? existingMember.email.trim().toLowerCase()
                : "";

            const phoneMatches =
              normalizedPhone &&
              existingPhone === normalizedPhone;

            const emailMatches =
              normalizedEmail &&
              existingEmail === normalizedEmail;

            return phoneMatches || emailMatches;
          }
        );

      if (duplicateActiveMember) {
        throw new HttpsError(
          "already-exists",
          "An active member with the same phone number or email already exists in this cooperative."
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

  const pendingApplicationsQuery =
    db
      .collection("membershipApplications")
      .where("cooperativeId", "==", cooperativeId)
      .where("status", "==", "pending");

  const pendingApplicationsSnapshot =
    await pendingApplicationsQuery.get();

  const normalizedPhone =
    phone.trim();

  const normalizedEmail =
    email.trim().toLowerCase();

  const duplicatePendingApplication =
    pendingApplicationsSnapshot.docs.find(
      (document) => {
        const application =
          document.data();

        const applicationPhone =
          typeof application.phone === "string"
            ? application.phone.trim()
            : "";

        const applicationEmail =
          typeof application.email === "string"
            ? application.email.trim().toLowerCase()
            : "";

        const phoneMatches =
          normalizedPhone &&
          applicationPhone === normalizedPhone;

        const emailMatches =
          normalizedEmail &&
          applicationEmail === normalizedEmail;

        return phoneMatches || emailMatches;
      }
    );

  if (duplicatePendingApplication) {
    throw new HttpsError(
      "already-exists",
      "A pending membership application already exists for this applicant."
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

exports.submitCooperativeApplication = onCall(async (request) => {
  /*
   * Public cooperative application boundary.
   *
   * This function replaces the former unrestricted client-side
   * Firestore create path. The client may submit an application,
   * but cannot directly write to cooperatives/{cooperativeId}.
   */

  const data = request.data || {};

  const requiredStrings = {
    coopName: data.coopName,
    registrationNumber: data.registrationNumber,
    coopType: data.coopType,
    country: data.country,
    state: data.state,
    city: data.city,
    officeAddress: data.officeAddress,
    coopEmail: data.coopEmail,
    coopPhone: data.coopPhone,
    adminName: data.adminName,
    adminEmail: data.adminEmail,
    subscriptionPlan: data.subscriptionPlan,
  };

  for (const [field, value] of Object.entries(requiredStrings)) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new HttpsError(
        "invalid-argument",
        `A valid ${field} is required.`
      );
    }
  }

  const crypto = require("crypto");

  const cooperativeId =
    `CMP-${data.country.trim().toUpperCase()}-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase()}`;

  const cooperativeRef = db
    .collection("cooperatives")
    .doc(cooperativeId);

  await cooperativeRef.create({
    cooperativeId,
    cooperativeName: data.coopName.trim(),
    registrationNumber: data.registrationNumber.trim(),
    cooperativeType: data.coopType.trim(),
    country: data.country.trim(),
    state: data.state.trim(),
    city: data.city.trim(),
    officeAddress: data.officeAddress.trim(),
    officialEmail: data.coopEmail.trim().toLowerCase(),
    officialPhone: data.coopPhone.trim(),
    administratorName: data.adminName.trim(),
    administratorEmail: data.adminEmail.trim().toLowerCase(),
    subscriptionPlan: data.subscriptionPlan.trim(),
    status: "pending",
    createdAt: FieldValue.serverTimestamp(),
  });

  logger.info("Cooperative application submitted", {
    cooperativeId,
  });

  return {
    success: true,
    cooperativeId,
    message: "Cooperative application submitted successfully.",
  };
});

exports.approveCooperative = onCall(async (request) => {
  /*
   * 1. The caller must be authenticated.
   */
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be signed in to approve a cooperative."
    );
  }

  const approverUid = request.auth.uid;

  /*
   * 2. Verify the caller is actually a Super Admin.
   *
   * The role comes from Firestore users/{uid}, which is
   * the same authorization model already used by the frontend.
   */
  const approverRef = db.collection("users").doc(approverUid);
  const approverSnap = await approverRef.get();

  if (!approverSnap.exists) {
    throw new HttpsError(
      "permission-denied",
      "Administrator profile not found."
    );
  }

  const approverData = approverSnap.data();

  if (approverData.role !== "super_admin") {
    throw new HttpsError(
      "permission-denied",
      "Only a Super Admin can approve cooperative applications."
    );
  }

  /*
   * 3. Validate the cooperative ID supplied by the client.
   */
  const cooperativeId = request.data?.cooperativeId;

  if (
    typeof cooperativeId !== "string" ||
    cooperativeId.trim() === ""
  ) {
    throw new HttpsError(
      "invalid-argument",
      "A valid cooperativeId is required."
    );
  }

  /*
   * 4. Read the pending cooperative application.
   */
  const cooperativeRef = db
    .collection("cooperatives")
    .doc(cooperativeId);

  const cooperativeSnap = await cooperativeRef.get();

  if (!cooperativeSnap.exists) {
    throw new HttpsError(
      "not-found",
      "Cooperative application not found."
    );
  }

  const cooperative = cooperativeSnap.data();

  /*
   * Prevent approving something that has already been processed.
   */
  if (cooperative.status !== "pending") {
    throw new HttpsError(
      "failed-precondition",
      `This cooperative application is already ${cooperative.status}.`
    );
  }

  const administratorEmail =
    typeof cooperative.administratorEmail === "string"
      ? cooperative.administratorEmail.trim().toLowerCase()
      : "";

  const administratorName =
    typeof cooperative.administratorName === "string"
      ? cooperative.administratorName.trim()
      : "";

  if (!administratorEmail || !administratorName) {
    throw new HttpsError(
      "failed-precondition",
      "The cooperative application is missing administrator information."
    );
  }

  /*
   * 5. Make sure an Auth account does not already exist.
   *
   * We deliberately do NOT create the account in browser JavaScript.
   */
  let administratorUser;

  try {
    administratorUser = await auth.getUserByEmail(administratorEmail);

    throw new HttpsError(
      "already-exists",
      "An account already exists for the administrator email."
    );
  } catch (error) {
    /*
     * USER_NOT_FOUND is the expected case.
     * Any other error must be propagated.
     */
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  /*
   * 6. Create the Firebase Authentication account.
   *
   * A random password is generated server-side. The administrator
   * will use a password-reset/setup link rather than receiving this
   * password.
   */
  const temporaryPassword = crypto.randomUUID() + "A9!";

  try {
    administratorUser = await auth.createUser({
      email: administratorEmail,
      displayName: administratorName,
      password: temporaryPassword,
      emailVerified: false,
      disabled: false,
    });


  } catch (error) {
    logger.error("Administrator Auth account creation failed", {
      cooperativeId,
      administratorEmail,
      error: error.message,
    });

    throw new HttpsError(
      "internal",
      "Unable to create the cooperative administrator account."
    );
  }

  /*
   * 7. Create the application's user profile.
   */
  const userRef = db.collection("users").doc(administratorUser.uid);

  await userRef.set({
    uid: administratorUser.uid,
    name: administratorName,
    displayName: administratorName,
    email: administratorEmail,
    role: "cooperative_admin",
    cooperativeId: cooperativeId,
    status: "active",
    createdAt: FieldValue.serverTimestamp(),
    createdBy: approverUid,
  });

  /*
   * 8. Activate the cooperative and link its administrator.
   */
  await cooperativeRef.update({
    status: "active",
    administratorUid: administratorUser.uid,
    approvedBy: approverUid,
    approvedAt: FieldValue.serverTimestamp(),
  });

  /*
   * 9. Generate the password setup link.
   *
   * We do not store it in Firestore.
   * We also do not expose it in the production response yet.
   * Email delivery will be added as a separate step.
   */
  let passwordSetupLink = null;

  try {
    passwordSetupLink = await auth.generatePasswordResetLink(
      administratorEmail
    );
  } catch (error) {
    logger.error("Password setup link generation failed", {
      cooperativeId,
      administratorEmail,
      error: error.message,
    });
  }

  logger.info("Cooperative approved successfully", {
    cooperativeId,
    administratorUid: administratorUser.uid,
    approvedBy: approverUid,
  });

  return {
    success: true,
    cooperativeId,
    administratorUid: administratorUser.uid,
    administratorEmail,
    passwordSetupLink,
    message:
      "Cooperative approved and administrator account created.",
  };
});

exports.rejectCooperative = onCall(async (request) => {
  /*
   * 1. The caller must be authenticated.
   */
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be signed in to reject a cooperative."
    );
  }

  const rejectorUid = request.auth.uid;

  /*
   * 2. Verify the caller is actually a Super Admin.
   */
  const rejectorRef = db.collection("users").doc(rejectorUid);
  const rejectorSnap = await rejectorRef.get();

  if (!rejectorSnap.exists) {
    throw new HttpsError(
      "permission-denied",
      "Administrator profile not found."
    );
  }

  const rejectorData = rejectorSnap.data();

  if (rejectorData.role !== "super_admin") {
    throw new HttpsError(
      "permission-denied",
      "Only a Super Admin can reject cooperative applications."
    );
  }

  /*
   * 3. Validate the cooperative ID.
   */
  const cooperativeId = request.data?.cooperativeId;

  if (
    typeof cooperativeId !== "string" ||
    cooperativeId.trim() === ""
  ) {
    throw new HttpsError(
      "invalid-argument",
      "A valid cooperativeId is required."
    );
  }

  /*
   * 4. Read the cooperative application.
   */
  const cooperativeRef = db
    .collection("cooperatives")
    .doc(cooperativeId);

  const cooperativeSnap = await cooperativeRef.get();

  if (!cooperativeSnap.exists) {
    throw new HttpsError(
      "not-found",
      "Cooperative application not found."
    );
  }

  const cooperative = cooperativeSnap.data();

  /*
   * 5. Only pending applications may be rejected.
   */
  if (cooperative.status !== "pending") {
    throw new HttpsError(
      "failed-precondition",
      "This cooperative application is already " +
        cooperative.status +
        "."
    );
  }

  /*
   * 6. Reject the cooperative application.
   */
  await cooperativeRef.update({
    status: "rejected",
    rejectedBy: rejectorUid,
    rejectedAt: FieldValue.serverTimestamp(),
  });

  logger.info("Cooperative rejected successfully", {
    cooperativeId,
    rejectedBy: rejectorUid,
  });

  return {
    success: true,
    cooperativeId,
    rejectedBy: rejectorUid,
    message: "Cooperative application rejected.",
  };
});
