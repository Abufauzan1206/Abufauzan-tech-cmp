import fs from "fs";

const adapterPath =
    "js/adapters/firebaseAdapter.js";

const repositoryPath =
    "js/repositories/membershipApplicationRepository.js";

const enginePath =
    "js/business/membershipApplicationEngine.js";

const adapter =
    fs.readFileSync(adapterPath, "utf8");

const repository =
    fs.readFileSync(repositoryPath, "utf8");

const engine =
    fs.readFileSync(enginePath, "utf8");

const adapterNormalized =
    adapter.replace(/\s+/g, " ");

const repositoryNormalized =
    repository.replace(/\s+/g, " ");

const engineNormalized =
    engine.replace(/\s+/g, " ");

const checks = [
    [
        "ADAPTER_QUERY_EXISTS",
        adapter.includes(
            "async findAllByCooperativeId(cooperativeId)"
        )
    ],
    [
        "ADAPTER_USES_COOPERATIVE_FILTER",
        adapterNormalized.includes(
            'where( "cooperativeId", "==", normalizedCooperativeId )'
        )
    ],
    [
        "ADAPTER_NORMALIZES_COOPERATIVE_ID",
        adapter.includes(
            "const normalizedCooperativeId ="
        ) &&
        adapter.includes(
            "cooperativeId.trim()"
        )
    ],
    [
        "REPOSITORY_QUERY_EXISTS",
        repository.includes(
            "async findAllByCooperativeId(cooperativeId)"
        )
    ],
    [
        "REPOSITORY_DELEGATES_TO_ADAPTER",
        repositoryNormalized.includes(
            "this.adapter.findAllByCooperativeId( normalizedCooperativeId )"
        )
    ],
    [
        "REPOSITORY_NORMALIZES_COOPERATIVE_ID",
        repository.includes(
            "const normalizedCooperativeId ="
        ) &&
        repository.includes(
            "cooperativeId.trim()"
        )
    ],
    [
        "ENGINE_QUERY_EXISTS",
        engine.includes(
            "static async getByCooperativeId(cooperativeId)"
        )
    ],
    [
        "ENGINE_DELEGATES_TO_APPLICATION_REPOSITORY",
        engineNormalized.includes(
            "CMPRepositoryManager .membershipApplication .findAllByCooperativeId( normalizedCooperativeId )"
        )
    ],
    [
        "ENGINE_NORMALIZES_COOPERATIVE_ID",
        engine.includes(
            "const normalizedCooperativeId ="
        ) &&
        engine.includes(
            "cooperativeId.trim()"
        )
    ],
    [
        "ENGINE_REJECTS_EMPTY_COOPERATIVE_ID",
        engine.includes(
            '"Cooperative ID is required."'
        )
    ],
    [
        "GENERIC_GET_ALL_REMAINS_PRESENT",
        engine.includes(
            "static async getAll()"
        )
    ],
    [
        "NO_DIRECT_FIRESTORE_IN_ENGINE",
        !engine.includes("getDocs(") &&
        !engine.includes("collection(") &&
        !engine.includes("where(")
    ],
    [
        "NO_MEMBER_REPOSITORY_IN_ENGINE",
        !engine.includes(
            "CMPMemberRepository"
        )
    ]
];

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log(
    "RC406-D60 — MEMBERSHIP APPLICATION COOPERATIVE RETRIEVAL AUDIT"
);
console.log("===============================================");

let failed = false;

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
        "RC406-D60 MEMBERSHIP APPLICATION COOPERATIVE RETRIEVAL AUDIT: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D60 MEMBERSHIP APPLICATION COOPERATIVE RETRIEVAL AUDIT: PASS"
    );
}

console.log("===============================================");
