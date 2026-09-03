import { patch } from "../patchEngine.js";

const result = await patch({
    path: "functions/index.js",
    mode: "exact",
    search: `      if (!firstName || !lastName || !phone) {
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

      transaction.create(memberRef, memberData);`,
    replace: `      if (!firstName || !lastName || !phone) {
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

      transaction.create(memberRef, memberData);`
});

console.log(
    "RC406-D83 PATCH RESULT:",
    JSON.stringify(result, null, 2)
);

if (!result?.success) {
    process.exit(1);
}

console.log(
    "RC406-D83 APPROVAL DUPLICATE MEMBER PROTECTION: PASS"
);
