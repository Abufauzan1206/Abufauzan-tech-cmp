import { patch } from "../patchEngine.js";

const result = await patch({
    path: "js/business/membershipApplicationEngine.js",
    mode: "exact",
    search: `        const newApplication = {
            ...application,
            applicationId: CMPIdService.generate("MAP"),
            status: "pending",
            submittedAt: new Date()
        };`,
    replace: `        const cooperativeId =
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
        };`
});

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D58 — MEMBERSHIP APPLICATION SUBMISSION CONTRACT");
console.log("===============================================");
console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    console.log("");
    console.log(
        "RC406-D58 MEMBERSHIP APPLICATION SUBMISSION CONTRACT: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log("");
    console.log(
        "RC406-D58 MEMBERSHIP APPLICATION SUBMISSION CONTRACT: PASS"
    );
}

console.log("===============================================");
