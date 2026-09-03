import { patch } from "../patchEngine.js";

const result = await patch({
    path: "js/business/membershipApplicationEngine.js",
    mode: "exact",
    search: `        if (!application.fullName) {
            throw new Error(
                "Applicant full name is required."
            );
        }

        if (!application.phone) {
            throw new Error(
                "Applicant phone is required."
            );
        }

        const cooperativeId =
            typeof application.cooperativeId === "string"
                ? application.cooperativeId.trim()
                : "";

        const fullName =
            typeof application.fullName === "string"
                ? application.fullName.trim()
                : "";

        const phone =
            typeof application.phone === "string"
                ? application.phone.trim()
                : "";

        const email =
            typeof application.email === "string"
                ? application.email.trim()
                : "";

        if (!cooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        if (!fullName) {
            throw new Error(
                "Applicant full name is required."
            );
        }

        if (!phone) {
            throw new Error(
                "Applicant phone is required."
            );
        }

        const newApplication = {
            applicationId: CMPIdService.generate("MAP"),
            cooperativeId,
            fullName,
            phone,
            ...(email ? { email } : {}),
            status: "pending",
            submittedAt: new Date()
        };`,
    replace: `        if (!application.firstName) {
            throw new Error(
                "Applicant first name is required."
            );
        }

        if (!application.lastName) {
            throw new Error(
                "Applicant last name is required."
            );
        }

        if (!application.phone) {
            throw new Error(
                "Applicant phone is required."
            );
        }

        const cooperativeId =
            typeof application.cooperativeId === "string"
                ? application.cooperativeId.trim()
                : "";

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
                ? application.email.trim()
                : "";

        if (!cooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        if (!firstName) {
            throw new Error(
                "Applicant first name is required."
            );
        }

        if (!lastName) {
            throw new Error(
                "Applicant last name is required."
            );
        }

        if (!phone) {
            throw new Error(
                "Applicant phone is required."
            );
        }

        const newApplication = {
            applicationId: CMPIdService.generate("MAP"),
            cooperativeId,
            firstName,
            ...(middleName ? { middleName } : {}),
            lastName,
            phone,
            ...(email ? { email } : {}),
            status: "pending",
            submittedAt: new Date()
        };`
});

console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exit(1);
}

console.log("RC406-D61 MEMBERSHIP APPLICATION IDENTITY CONTRACT: PASS");
