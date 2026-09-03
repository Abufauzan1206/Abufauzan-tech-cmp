import fs from "fs";

const file =
    "js/services/membershipApplicationService.js";

const source = fs.readFileSync(file, "utf8");

const checks = [
    [
        "APPLICATION_ENGINE_IMPORT_REMAINS",
        source.includes(
            'from "../business/membershipApplicationEngine.js";'
        )
    ],
    [
        "FIREBASE_FUNCTIONS_IMPORT_EXISTS",
        source.includes("getFunctions") &&
        source.includes("httpsCallable")
    ],
    [
        "FIREBASE_FUNCTIONS_MODULE_CORRECT",
        source.includes(
            'https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js'
        )
    ],
    [
        "FUNCTIONS_CLIENT_INITIALIZED",
        source.includes(
            "const functions = getFunctions();"
        )
    ],
    [
        "CALLABLE_REFERENCE_EXISTS",
        source.includes(
            "const submitMembershipApplicationCallable"
        ) &&
        source.includes(
            '"submitMembershipApplication"'
        )
    ],
    [
        "SUBMISSION_SERVICE_EXISTS",
        source.includes(
            "export async function submitMembershipApplication(data)"
        )
    ],
    [
        "SUBMISSION_INPUT_VALIDATED",
        source.includes(
            'if (!data || typeof data !== "object")'
        )
    ],
    [
        "SUBMISSION_USES_CALLABLE",
        source.includes(
            "await submitMembershipApplicationCallable(data)"
        )
    ],
    [
        "CALLABLE_SUCCESS_CHECK",
        source.includes(
            "if (!result?.data?.success)"
        )
    ],
    [
        "CALLABLE_ERROR_MESSAGE",
        source.includes(
            "result?.data?.message"
        )
    ],
    [
        "CALLABLE_RESULT_RETURNED",
        source.includes(
            "return result.data;"
        )
    ],
    [
        "NO_DIRECT_ENGINE_SUBMISSION",
        !source.includes(
            "CMPMembershipApplicationEngine.submit(data)"
        )
    ],
    [
        "GET_BY_ID_SERVICE_REMAINS",
        source.includes(
            "export async function getMembershipApplicationById(applicationId)"
        )
    ],
    [
        "GET_BY_ID_ENGINE_REMAINS",
        source.includes(
            "CMPMembershipApplicationEngine.getById("
        ) &&
        source.includes("applicationId")
    ],
    [
        "GET_ALL_SERVICE_REMAINS",
        source.includes(
            "export async function getMembershipApplications()"
        )
    ],
    [
        "GET_ALL_ENGINE_REMAINS",
        source.includes(
            "CMPMembershipApplicationEngine.getAll()"
        )
    ],
    [
        "COOPERATIVE_QUERY_SERVICE_REMAINS",
        source.includes(
            "export async function getMembershipApplicationsByCooperativeId("
        )
    ],
    [
        "COOPERATIVE_QUERY_ENGINE_REMAINS",
        source.includes(
            ".getByCooperativeId(cooperativeId)"
        )
    ]
];

let failed = false;

for (const [name, passed] of checks) {
    console.log(
        `${name}: ${passed ? "PASS" : "FAIL"}`
    );

    if (!passed) {
        failed = true;
    }
}

if (failed) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D67 PUBLIC MEMBERSHIP SUBMISSION SERVICE AUDIT: FAIL"
    );
}

console.log(
    "RC406-D67 PUBLIC MEMBERSHIP SUBMISSION SERVICE AUDIT: PASS"
);
