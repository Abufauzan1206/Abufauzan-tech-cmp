import { patch } from "../patchEngine.js";

const result = await patch({
    path: "js/business/membershipApplicationEngine.js",
    mode: "exact",
    search: `    static async getAll() {
        return await CMPRepositoryManager
            .membershipApplication
            .findAll();
    }
}`,
    replace: `    static async getAll() {
        return await CMPRepositoryManager
            .membershipApplication
            .findAll();
    }

    /**
     * Retrieve membership applications for one cooperative.
     */
    static async getByCooperativeId(cooperativeId) {
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

        return await CMPRepositoryManager
            .membershipApplication
            .findAllByCooperativeId(
                normalizedCooperativeId
            );
    }
}`
});

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D60 — MEMBERSHIP APPLICATION COOPERATIVE ENGINE");
console.log("===============================================");
console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    console.log("");
    console.log(
        "RC406-D60 MEMBERSHIP APPLICATION COOPERATIVE ENGINE: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log("");
    console.log(
        "RC406-D60 MEMBERSHIP APPLICATION COOPERATIVE ENGINE: PASS"
    );
}

console.log("===============================================");
