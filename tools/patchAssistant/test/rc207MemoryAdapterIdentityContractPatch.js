import { patch } from "../patchEngine.js";

const patches = [
    {
        path: "js/adapters/memoryAdapter.js",
        search: `    async findById(
        id
    ) {
        return this.data.find(
            item =>
                item.id === id
        );
    }`,
        replace: `    matchesIdentity(item, id) {
        if (!item) {
            return false;
        }

        if (item.id === id) {
            return true;
        }

        const businessIdKey =
            Object.keys(item).find(
                key =>
                    key.endsWith("Id") &&
                    key !== "id"
            );

        return businessIdKey
            ? item[businessIdKey] === id
            : false;
    }

    async findById(
        id
    ) {
        return this.data.find(
            item =>
                this.matchesIdentity(item, id)
        );
    }`
    },
    {
        path: "js/adapters/memoryAdapter.js",
        search: `        const index =
            this.data.findIndex(
                item =>
                    item.id === id
            );`,
        replace: `        const index =
            this.data.findIndex(
                item =>
                    this.matchesIdentity(item, id)
            );`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC207 — MEMORY ADAPTER IDENTITY CONTRACT PATCH");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await patch(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("==================================================");
console.log(
    result.success
        ? "RC207 MEMORY ADAPTER IDENTITY CONTRACT: PASS"
        : "RC207 MEMORY ADAPTER IDENTITY CONTRACT: FAIL"
);
console.log("==================================================");
