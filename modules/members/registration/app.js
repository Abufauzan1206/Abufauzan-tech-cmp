import { registerMember } from "../../../js/services/memberService.js";
import { auth, db } from "../../../js/firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form =
    document.getElementById("registrationForm");

const message =
    document.getElementById("registrationMessage");

form?.addEventListener("submit", async event => {
    event.preventDefault();

    const fullName =
        document
            .getElementById("fullName")
            ?.value
            .trim();

    const nameParts = fullName
        ? fullName.split(/\s+/)
        : [];

    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ");

    const phone =
        document
            .getElementById("phoneNumber")
            ?.value
            .trim();


    const email =
        document
            .getElementById("email")
            ?.value
            .trim();

    if (!firstName || !lastName || !phone) {
        if (message) {
            message.textContent =
                "Full name and phone number are required.";
        }

        return;
    }

    if (message) {
        message.textContent =
            "Registering member...";
    }

    try {
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
            });

        console.log(
            "Member registered:",
            member
        );

        if (message) {
            message.textContent =
                `Member registered successfully. Member ID: ${member.memberId}`;
        }

        form.reset();

    } catch (error) {
        console.error(
            "Member registration failed:",
            error
        );

        if (message) {
            message.textContent =
                error?.message ||
                "Member registration failed.";
        }
    }
});