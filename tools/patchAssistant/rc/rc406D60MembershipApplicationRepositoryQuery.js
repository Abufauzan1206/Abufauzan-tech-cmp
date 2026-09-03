import { patch } from "../patchEngine.js";

const result = await patch({
    path: "js/repositories/membershipApplicationRepository.js",
    mode: "exact",
    search: `    constructor() {
        super(
            CMPAdapterFactory.firebase("membershipApplications")
        );
    }
}`,
    replace: `    constructor() {
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
});

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D60 — MEMBERSHIP APPLICATION REPOSITORY QUERY");
console.log("===============================================");
console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    console.log("");
    console.log(
        "RC406-D60 MEMBERSHIP APPLICATION REPOSITORY QUERY: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log("");
    console.log(
        "RC406-D60 MEMBERSHIP APPLICATION REPOSITORY QUERY: PASS"
    );
}

console.log("===============================================");
