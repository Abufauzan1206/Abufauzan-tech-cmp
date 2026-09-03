import fs from "fs";

const dashboard =
    fs.readFileSync(
        "modules/members/dashboard/app.js",
        "utf8"
    );

const memberEngine =
    fs.readFileSync(
        "js/business/memberEngine.js",
        "utf8"
    );

const memberRepository =
    fs.readFileSync(
        "js/repositories/memberRepository.js",
        "utf8"
    );

const baseRepository =
    fs.readFileSync(
        "js/repositories/baseRepository.js",
        "utf8"
    );

const memoryAdapter =
    fs.readFileSync(
        "js/adapters/memoryAdapter.js",
        "utf8"
    );

const firebaseAdapter =
    fs.readFileSync(
        "js/adapters/firebaseAdapter.js",
        "utf8"
    );

const checks = [
    [
        "DASHBOARD_EXISTS",
        dashboard.length > 0
    ],
    [
        "DASHBOARD_USES_AUTHORITATIVE_PROFILE",
        dashboard.includes(
            "getAuthenticatedProfile"
        )
    ],
    [
        "DASHBOARD_DERIVES_COOPERATIVE_ID",
        dashboard.includes(
            "session.profile?.cooperativeId"
        )
    ],
    [
        "DASHBOARD_CALLS_SCOPED_ENGINE",
        dashboard.includes(
            ".getByCooperativeId(cooperativeId)"
        )
    ],
    [
        "ENGINE_SCOPED_METHOD_EXISTS",
        memberEngine.includes(
            "static async getByCooperativeId"
        )
    ],
    [
        "ENGINE_DELEGATES_TO_REPOSITORY",
        memberEngine.includes(
            ".findAllByCooperativeId("
        )
    ],
    [
        "MEMBER_REPOSITORY_SCOPED_METHOD_EXISTS",
        memberRepository.includes(
            "findAllByCooperativeId"
        )
    ],
    [
        "MEMBER_REPOSITORY_DELEGATES_TO_ADAPTER",
        memberRepository.includes(
            ".findAllByCooperativeId("
        )
    ],
    [
        "BASE_REPOSITORY_SCOPED_METHOD_EXISTS",
        baseRepository.includes(
            "findAllByCooperativeId"
        )
    ],
    [
        "BASE_REPOSITORY_DELEGATES_TO_ADAPTER",
        baseRepository.includes(
            ".findAllByCooperativeId("
        )
    ],
    [
        "MEMORY_ADAPTER_SCOPED_METHOD_EXISTS",
        memoryAdapter.includes(
            "findAllByCooperativeId"
        )
    ],
    [
        "MEMORY_ADAPTER_FILTERS_COOPERATIVE_ID",
        memoryAdapter.includes(
            "record.cooperativeId ==="
        )
    ],
    [
        "FIREBASE_ADAPTER_SCOPED_METHOD_EXISTS",
        firebaseAdapter.includes(
            "findAllByCooperativeId"
        )
    ],
    [
        "FIREBASE_ADAPTER_FILTERS_COOPERATIVE_ID",
        firebaseAdapter.includes(
            '"cooperativeId"'
        ) &&
        firebaseAdapter.includes(
            'where('
        )
    ],
    [
        "DASHBOARD_HAS_NO_DIRECT_FIRESTORE",
        !dashboard.includes("getDocs") &&
        !dashboard.includes("collection(") &&
        !dashboard.includes("query(") &&
        !dashboard.includes("where(")
    ],
    [
        "DASHBOARD_DOES_NOT_USE_GET_ALL",
        !dashboard.includes(
            "CMPMemberEngine.getAll()"
        )
    ],
    [
        "ENGINE_RETAINED_UNSCOPED_GET_ALL",
        memberEngine.includes(
            "static getAll()"
        )
    ],
    [
        "REGISTRATION_OPERATION_REMAINS_ACTIVE",
        memberEngine.includes(
            'status: "active"'
        ) &&
        memberEngine.includes(
            "CMPRepositoryManager"
        ) &&
        memberEngine.includes(
            ".member"
        ) &&
        memberEngine.includes(
            ".create(newMember)"
        )
    ]
];

let failed = false;

for (const [name, result] of checks) {
    if (result) {
        console.log(name + ": PASS");
    } else {
        console.error(name + ": FAIL");
        failed = true;
    }
}

if (failed) {
    console.error(
        "RC406-D94 COOPERATIVE-SCOPED MEMBER RETRIEVAL AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D94 COOPERATIVE-SCOPED MEMBER RETRIEVAL AUDIT: PASS"
);
