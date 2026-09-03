import fs from "fs";

const dashboardPath =
    "modules/members/dashboard/app.js";

const accessControllerPath =
    "js/controllers/accessController.js";

const enginePath =
    "js/business/memberEngine.js";

const repositoryPath =
    "js/repositories/memberRepository.js";

const baseRepositoryPath =
    "js/repositories/baseRepository.js";

const firebaseAdapterPath =
    "js/adapters/firebaseAdapter.js";

const memoryAdapterPath =
    "js/adapters/memoryAdapter.js";

const dashboard =
    fs.readFileSync(dashboardPath, "utf8");

const accessController =
    fs.readFileSync(accessControllerPath, "utf8");

const engine =
    fs.readFileSync(enginePath, "utf8");

const repository =
    fs.readFileSync(repositoryPath, "utf8");

const baseRepository =
    fs.readFileSync(baseRepositoryPath, "utf8");

const firebaseAdapter =
    fs.readFileSync(firebaseAdapterPath, "utf8");

const memoryAdapter =
    fs.readFileSync(memoryAdapterPath, "utf8");

const checks = [
    [
        "DASHBOARD_EXISTS",
        dashboard.length > 0
    ],
    [
        "CENTRAL_PROFILE_AUTHORITY_EXISTS",
        accessController.includes(
            "getAuthenticatedProfile"
        )
    ],
    [
        "PROFILE_RETURNS_AUTHORITATIVE_PROFILE",
        accessController.includes(
            "profile: session.profile"
        )
    ],
    [
        "MEMBER_ENGINE_EXISTS",
        engine.length > 0
    ],
    [
        "MEMBER_REPOSITORY_EXISTS",
        repository.length > 0
    ],
    [
        "BASE_REPOSITORY_EXISTS",
        baseRepository.length > 0
    ],
    [
        "FIREBASE_MEMBER_ADAPTER_EXISTS",
        firebaseAdapter.includes(
            'CMPFirebaseAdapter'
        )
    ],
    [
        "FIREBASE_COOPERATIVE_QUERY_EXISTS",
        firebaseAdapter.includes(
            "findAllByCooperativeId"
        )
    ],
    [
        "FIREBASE_COOPERATIVE_FILTER_EXISTS",
        firebaseAdapter.includes(
            '"cooperativeId"'
        )
    ],
    [
        "MEMORY_ADAPTER_EXISTS",
        memoryAdapter.includes(
            "class CMPMemoryAdapter"
        )
    ],
    [
        "DASHBOARD_CURRENTLY_COOPERATIVE_SCOPED",
        dashboard.includes(
            ".getByCooperativeId(cooperativeId)"
        )
    ],
    [
        "MEMBER_ENGINE_CURRENTLY_UNSCOPED",
        engine.includes(
            ".member"
        ) &&
        engine.includes(
            ".findAll()"
        )
    ],
    [
        "MEMBER_REGISTRATION_REMAINS_PRESENT",
        engine.includes(
            "static async register(member)"
        )
    ],
    [
        "MEMBER_REGISTRATION_REMAINS_ACTIVE",
        engine.includes(
            'status: "active"'
        )
    ],
    [
        "NO_DASHBOARD_DIRECT_FIRESTORE",
        !dashboard.includes(
            "firebase-firestore.js"
        ) &&
        !dashboard.includes(
            "getDocs("
        )
    ]
];

let failed = false;

for (const [name, passed] of checks) {
    const status =
        passed ? "PASS" : "FAIL";

    if (!passed) {
        failed = true;
    }

    console.log(
        `${name}: ${status}`
    );
}

if (failed) {
    console.error(
        "RC406-D93 COOPERATIVE-SCOPED MEMBER RETRIEVAL AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D93 COOPERATIVE-SCOPED MEMBER RETRIEVAL AUDIT: PASS"
);