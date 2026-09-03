import { patch } from "../patchEngine.js";

const result = await patch({
    path: "functions/index.js",
    mode: "exact",
    search: `  if (cooperative?.status !== "active") {
    throw new HttpsError(
      "failed-precondition",
      "Selected cooperative is not accepting membership applications."
    );
  }

  const applicationRef =
    db.collection("membershipApplications").doc();`,
    replace: `  if (cooperative?.status !== "active") {
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
    db.collection("membershipApplications").doc();`
});

console.log(
    "RC406-D81 PATCH RESULT:",
    JSON.stringify(result, null, 2)
);

if (!result?.success) {
    process.exit(1);
}

console.log(
    "RC406-D81 PENDING MEMBERSHIP DUPLICATE PROTECTION: PASS"
);
