import fs from "fs";

const path =
    "js/services/membershipApplicationService.js";

const source = fs.readFileSync(path, "utf8");

const checks = [
    [
        "SUBMIT_SERVICE_EXISTS",
        source.includes(
            "export async function submitMembershipApplication"
        )
    ],
    [
        "GET_BY_ID_SERVICE_EXISTS",
        source.includes(
            "export async function getMembershipApplicationById"
        )
    ],
    [
        "GET_ALL_SERVICE_EXISTS",
        source.includes(
            "export async function getMembershipApplications"
        )
    ],
    [
        "COOPERATIVE_QUERY_SERVICE_EXISTS",
        source.includes(
            "export async function getMembershipApplicationsByCooperativeId"
        )
    ],
    [
        "COOPERATIVE_QUERY_DELEGATES_TO_ENGINE",
        source.includes(
            ".getByCooperativeId(cooperativeId)"
        )
    ],
    [
        "SERVICE_USES_APPLICATION_ENGINE",
        source.includes(
            "CMPMembershipApplicationEngine"
        )
    ],
    [
        "NO_DIRECT_MEMBER_SERVICE_USAGE",
        !source.includes(
            "registerMember("
        )
    ],
    [
        "NO_DIRECT_FIRESTORE_USAGE",
        !source.includes(
            "getDocs("
        ) &&
        !source.includes(
            "collection("
        ) &&
        !source.includes(
            "doc("
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
    console.error(
        "RC406-D62 MEMBERSHIP APPLICATION SERVICE COOPERATIVE QUERY AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D62 MEMBERSHIP APPLICATION SERVICE COOPERATIVE QUERY AUDIT: PASS"
);
