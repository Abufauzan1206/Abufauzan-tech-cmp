import fs from "fs";

const path = "js/business/membershipApplicationEngine.js";
const source = fs.readFileSync(path, "utf8");

const checks = [
    [
        "ENGINE_EXISTS",
        source.includes("export class CMPMembershipApplicationEngine")
    ],
    [
        "SUBMIT_METHOD_EXISTS",
        source.includes("static async submit(application)")
    ],
    [
        "COOPERATIVE_ID_NORMALIZED",
        source.includes(
            'typeof application.cooperativeId === "string"'
        )
        && source.includes(
            "const cooperativeId ="
        )
    ],
    [
        "FULL_NAME_NORMALIZED",
        source.includes(
            'typeof application.fullName === "string"'
        )
        && source.includes(
            "const fullName ="
        )
    ],
    [
        "PHONE_NORMALIZED",
        source.includes(
            'typeof application.phone === "string"'
        )
        && source.includes(
            "const phone ="
        )
    ],
    [
        "OPTIONAL_EMAIL_NORMALIZED",
        source.includes(
            'typeof application.email === "string"'
        )
        && source.includes(
            "const email ="
        )
    ],
    [
        "APPLICATION_ID_GENERATED",
        source.includes(
            'applicationId: CMPIdService.generate("MAP")'
        )
    ],
    [
        "PENDING_STATUS_FORCED",
        source.includes(
            'status: "pending"'
        )
    ],
    [
        "SUBMITTED_AT_CREATED",
        source.includes(
            "submittedAt: new Date()"
        )
    ],
    [
        "ARBITRARY_INPUT_SPREAD_REMOVED",
        !source.includes(
            "...application,"
        )
    ],
    [
        "APPLICATION_PERSISTED",
        source.includes(
            ".membershipApplication"
        )
        && source.includes(
            ".create(newApplication)"
        )
    ],
    [
        "MEMBER_ENGINE_NOT_USED_FOR_APPLICATION",
        !source
            .split("\n")
            .filter((line) => !line.trim().startsWith("*"))
            .join("\n")
            .includes(
                "CMPMemberEngine.register("
            )
    ]
];

let failed = false;

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D58 — MEMBERSHIP APPLICATION SUBMISSION CONTRACT AUDIT");
console.log("===============================================");

for (const [name, passed] of checks) {
    console.log(
        `${name}: ${passed ? "PASS" : "FAIL"}`
    );

    if (!passed) {
        failed = true;
    }
}

console.log("-----------------------------------------------");

if (failed) {
    console.log(
        "RC406-D58 MEMBERSHIP APPLICATION SUBMISSION CONTRACT AUDIT: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D58 MEMBERSHIP APPLICATION SUBMISSION CONTRACT AUDIT: PASS"
    );
}

console.log("===============================================");
