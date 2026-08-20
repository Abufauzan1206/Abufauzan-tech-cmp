import { registerMember } from "../../../js/services/memberService.js";

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

    const phoneNumber = phone;

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
        const member =
            await registerMember({
                firstName,
                lastName,
                phone,
                email
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