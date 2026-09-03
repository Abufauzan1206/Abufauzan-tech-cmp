import fs from "fs";

const path = "js/business/membershipApplicationEngine.js";
const source = fs.readFileSync(path, "utf8");

const checks = [
    [
        "GET_BY_ID_EXISTS",
        source.includes("static async getById(applicationId)")
    ],
    [
        "GET_ALL_EXISTS",
        source.includes("static async getAll()")
    ],
    [
        "GET_BY_ID_USES_APPLICATION_REPOSITORY",
        source.includes(
            "CMPRepositoryManager"
        )
        && source.includes(
            ".membershipApplication"
        )
        && source.includes(
            ".findById(applicationId)"
        )
    ],
    [
        "GET_ALL_USES_APPLICATION_REPOSITORY",
        source.includes(
            ".membershipApplication"
        )
        && source.includes(
            ".findAll()"
        )
    ],
    [
        "NO_MEMBER_REPOSITORY_FOR_APPLICATIONS",
        !source.includes(
            "CMPRepositoryManager.member"
        )
    ],
    [
        "NO_DIRECT_FIRESTORE_ACCESS",
        !source.includes(
            "firebase-firestore"
        )
    ]
];

let failed = false;

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D59 — MEMBERSHIP APPLICATION OWNERSHIP CONTRACT AUDIT");
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
        "RC406-D59 MEMBERSHIP APPLICATION OWNERSHIP CONTRACT AUDIT: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC406-D59 MEMBERSHIP APPLICATION OWNERSHIP CONTRACT AUDIT: PASS"
    );
}

console.log("===============================================");
