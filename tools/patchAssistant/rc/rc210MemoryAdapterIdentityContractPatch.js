import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/adapters/memoryAdapter.js",
        mode: "text",

        search: `    async findById(
        id
    ) {
        return this.data.find(
            item =>
                item.id === id
        );
    }`,

        replace: `    matchesIdentity(
        item,
        id
    ) {
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
                this.matchesIdentity(
                    item,
                    id
                )
        );
    }`
    },

    {
        path: "js/adapters/memoryAdapter.js",
        mode: "text",

        search: `    async update(
        id,
        updates
    ) {
        const index =
            this.data.findIndex(
                item =>
                    item.id === id
            );`,

        replace: `    async update(
        id,
        updates
    ) {
        const index =
            this.data.findIndex(
                item =>
                    this.matchesIdentity(
                        item,
                        id
                    )
            );`
    },

    {
        path: "js/adapters/memoryAdapter.js",
        mode: "text",

        search: `    async delete(
        id
    ) {
        const index =
            this.data.findIndex(
                item =>
                    item.id === id
            );`,

        replace: `    async delete(
        id
    ) {
        const index =
            this.data.findIndex(
                item =>
                    this.matchesIdentity(
                        item,
                        id
                    )
            );`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC210 — MEMORY ADAPTER IDENTITY CONTRACT PATCH");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("");

if (!result.success) {
    console.log(
        "RC210 MEMORY ADAPTER IDENTITY CONTRACT: FAIL"
    );
    process.exitCode = 1;
} else {
    console.log(
        "RC210 MEMORY ADAPTER IDENTITY CONTRACT: PASS"
    );
}

console.log("==================================================");
