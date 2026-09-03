import { patch } from "../patchEngine.js";

const result = await patch({
    path: "js/adapters/firebaseAdapter.js",
    mode: "exact",
    search: `    async findAll() {

        const snapshot = await getDocs(
            collection(db, this.collectionName)
        );

        const records = [];

        snapshot.forEach((document) => {

            records.push({

                id: document.id,

                ...document.data()

            });

        });

        return records;

    }`,
    replace: `    async findAll() {

        const snapshot = await getDocs(
            collection(db, this.collectionName)
        );

        const records = [];

        snapshot.forEach((document) => {

            records.push({

                id: document.id,

                ...document.data()

            });

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
});

console.log("===============================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC406-D60 — COOPERATIVE APPLICATION ADAPTER QUERY");
console.log("===============================================");
console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {

    console.log("");
    console.log(
        "RC406-D60 COOPERATIVE APPLICATION ADAPTER QUERY: FAIL"
    );

    process.exitCode = 1;

} else {

    console.log("");
    console.log(
        "RC406-D60 COOPERATIVE APPLICATION ADAPTER QUERY: PASS"
    );

}

console.log("===============================================");
