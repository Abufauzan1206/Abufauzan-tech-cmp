import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/repositories/membershipApplicationRepository.js",
        mode: "exact",
        search: `export class CMPMembershipApplicationRepository
    extends CMPBaseRepository {
    constructor() {
        super(
            CMPAdapterFactory.firebase("membershipApplications")
        );
    }
}`,
        replace: `export class CMPMembershipApplicationRepository
    extends CMPBaseRepository {
    constructor() {
        super(
            CMPAdapterFactory.firebase("membershipApplications")
        );
    }

    async findAllByCooperativeId(cooperativeId) {
        if (typeof cooperativeId !== "string") {
            throw new TypeError(
                "Cooperative ID must be a string."
            );
        }

        const normalizedCooperativeId =
            cooperativeId.trim();

        if (!normalizedCooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        return await this.adapter.findAllByCooperativeId(
            normalizedCooperativeId
        );
    }
}`
    },

    {
        path: "js/adapters/firebaseAdapter.js",
        mode: "exact",
        search: `    async findAll() {
        const snapshot = await getDocs(collection(db, this.collectionName));
        const records = [];
        snapshot.forEach((document) => {
            records.push({ id: document.id, ...document.data() });
        });
        return records;
    }`,
        replace: `    async findAll() {
        const snapshot = await getDocs(collection(db, this.collectionName));
        const records = [];
        snapshot.forEach((document) => {
            records.push({ id: document.id, ...document.data() });
        });
        return records;
    }

    async findAllByCooperativeId(cooperativeId) {
        if (typeof cooperativeId !== "string") {
            throw new TypeError(
                "Cooperative ID must be a string."
            );
        }

        const normalizedCooperativeId =
            cooperativeId.trim();

        if (!normalizedCooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        const snapshot = await getDocs(
            query(
                collection(db, this.collectionName),
                where(
                    "cooperativeId",
                    "==",
                    normalizedCooperativeId
                )
            )
        );

        const records = [];

        snapshot.forEach((document) => {
            records.push({
                id: document.id,
                ...document.data()
            });
        });

        return records;
    }`
    }
];

const result = await transaction(patches);

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D60 — MEMBERSHIP APPLICATION COOPERATIVE RETRIEVAL");
console.log("===============================================");
console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    console.log("");
    console.log(
        "RC406-D60 MEMBERSHIP APPLICATION COOPERATIVE RETRIEVAL: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log("");
    console.log(
        "RC406-D60 MEMBERSHIP APPLICATION COOPERATIVE RETRIEVAL: PASS"
    );
}

console.log("===============================================");
