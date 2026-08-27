import { transaction } from "../patchEngine.js";

const patches = [
  {
    path: "modules/members/registration/app.js",
    mode: "exact",
    search: `import { registerMember } from "../../../js/services/memberService.js";`,
    replace: `import { registerMember } from "../../../js/services/memberService.js";
import { auth, db } from "../../../js/firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`
  },
  {
    path: "modules/members/registration/app.js",
    mode: "exact",
    search: `try {
        const member =
            await registerMember({
                firstName,
                lastName,
                phone,
                email
            });`,
    replace: `try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("You must be signed in to register a member.");
        }

        const profileSnap = await getDoc(
            doc(db, "users", user.uid)
        );

        if (!profileSnap.exists()) {
            throw new Error("Authenticated user profile not found.");
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

        if (
            profile.role === "cooperative_admin" &&
            !profile.cooperativeId
        ) {
            throw new Error(
                "Cooperative administrator has no cooperative ownership."
            );
        }

        const member =
            await registerMember({
                firstName,
                lastName,
                phone,
                email,
                cooperativeId: profile.cooperativeId ?? null
            });`
  }
];

const result = await transaction(patches);

console.log(JSON.stringify(result, null, 2));

if (!result?.success) {
    process.exitCode = 1;
}
