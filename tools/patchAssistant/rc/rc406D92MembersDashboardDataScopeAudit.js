import fs from "fs";

const dashboardPath =
    "modules/members/dashboard/app.js";

const enginePath =
    "js/business/memberEngine.js";

const repositoryPath =
    "js/repositories/memberRepository.js";

const adapterPath =
    "js/adapters/firebaseAdapter.js";

const dashboard =
    fs.readFileSync(
        dashboardPath,
        "utf8"
    );

const engine =
    fs.readFileSync(
        enginePath,
        "utf8"
    );

const repository =
    fs.readFileSync(
        repositoryPath,
        "utf8"
    );

const adapter =
    fs.readFileSync(
        adapterPath,
        "utf8"
    );

const checks = [
    [
        "DASHBOARD_EXISTS",
        dashboard.length > 0
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
        "FIREBASE_ADAPTER_EXISTS",
        adapter.length > 0
    ],
    [
        "DASHBOARD_CURRENTLY_USES_MEMBER_ENGINE",
        dashboard.includes(
            "CMPMemberEngine"
        )
    ],
    [
        "DASHBOARD_CURRENTLY_USES_COOPERATIVE_SCOPED_RETRIEVAL",
        dashboard.includes(
            ".getByCooperativeId(cooperativeId)"
        )
    ],
    [
        "MEMBER_ENGINE_GET_ALL_EXISTS",
        engine.includes(
            "static getAll()"
        )
    ],
    [
        "MEMBER_ENGINE_GET_ALL_USES_UNSCOPED_REPOSITORY",
        engine.includes(
            ".member"
        ) &&
        engine.includes(
            ".findAll()"
        )
    ],
    [
        "FIREBASE_ADAPTER_UNSCOPED_FIND_ALL_EXISTS",
        adapter.includes(
            "async findAll()"
        ) &&
        adapter.includes(
            "collection(db, this.collectionName)"
        )
    ],
    [
        "COOPERATIVE_SCOPED_ADAPTER_METHOD_EXISTS",
        adapter.includes(
            "findAllByCooperativeId"
        )
    ],
    [
        "COOPERATIVE_SCOPED_QUERY_EXISTS",
        adapter.includes(
            "where("
        ) &&
        adapter.includes(
            '"cooperativeId"'
        )
    ],
    [
        "MEMBER_REPOSITORY_USES_FIREBASE_ADAPTER",
        repository.includes(
            'CMPAdapterFactory.firebase("members")'
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
        "RC406-D92 MEMBERS DASHBOARD DATA-SCOPE AUDIT: FAIL"
    );
    process.exit(1);
}

console.log(
    "RC406-D92 MEMBERS DASHBOARD DATA-SCOPE AUDIT: PASS"
);