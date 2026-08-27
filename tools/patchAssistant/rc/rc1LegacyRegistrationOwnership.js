import { transaction } from "../patchEngine.js";

const patches = [
  {
    path: "modules/member-registration/script.js",
    mode: "exact",
    search: `const result = await registerMember(memberData);`,
    replace: `const user = auth.currentUser;

      if (!user) {
        throw new Error(
          "You must be signed in to register a member."
        );
      }

      const profileSnap = await getDoc(
        doc(db, "users", user.uid)
      );

      if (!profileSnap.exists()) {
        throw new Error(
          "Authenticated user profile not found."
        );
      }

      const profile = profileSnap.data();

      if (
        profile.role !== "cooperative_admin" &&
        profile.role !== "super_admin"
      ) {
        throw new Error(
          "Only authorized administrators can register members."
        );
      }

      let cooperativeId = null;

      if (profile.role === "cooperative_admin") {
        if (!profile.cooperativeId) {
          throw new Error(
            "Cooperative administrator has no cooperative ownership."
          );
        }

        cooperativeId = profile.cooperativeId;
      } else {
        const selectedCooperative =
          document.getElementById("cooperative")?.value?.trim();

        if (!selectedCooperative) {
          throw new Error(
            "Please select a cooperative."
          );
        }

        const cooperativeQuery = query(
          collection(db, "cooperatives"),
          where("cooperativeName", "==", selectedCooperative)
        );

        const cooperativeSnapshot =
          await getDocs(cooperativeQuery);

        if (cooperativeSnapshot.empty) {
          throw new Error(
            "Selected cooperative was not found."
          );
        }

        if (cooperativeSnapshot.size !== 1) {
          throw new Error(
            "Selected cooperative could not be uniquely identified."
          );
        }

        cooperativeId =
          cooperativeSnapshot.docs[0].id;
      }

      memberData.cooperativeId = cooperativeId;

      const result = await registerMember(memberData);`
  }
];

const result = await transaction(patches);

console.log(JSON.stringify(result, null, 2));

if (!result?.success) {
  process.exitCode = 1;
}
