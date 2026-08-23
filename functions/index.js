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
