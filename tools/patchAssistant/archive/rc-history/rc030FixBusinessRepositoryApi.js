import { patch } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/contributionEngine.js",
        search: `.save(contribution)`,
        replace: `.create(newContribution)`
    },
    {
        path: "js/business/contributionEngine.js",
        search: `.getAll()`,
        replace: `.findAll()`
    },
    {
        path: "js/business/memberEngine.js",
        search: `.save(newMember)`,
        replace: `.create(newMember)`
    },
    {
        path: "js/business/memberEngine.js",
        search: `.getAll()`,
        replace: `.findAll()`
    },
    {
        path: "js/business/transactionEngine.js",
        search: `.save(newTransaction)`,
        replace: `.create(newTransaction)`
    },
    {
        path: "js/business/transactionEngine.js",
        search: `.getAll()`,
        replace: `.findAll()`
    }
];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC030 - FIX BUSINESS REPOSITORY API");
    console.log("=========================================");

    try {

        for (const item of patches) {

            const result = await patch(item);

            console.log("");
            console.log("PATCH:", item.path);
            console.log(result);

        }

        console.log("");
        console.log("RC030 PATCH: PASS");

    } catch (error) {

        console.log("");
        console.log("RC030 PATCH: FAIL");
        console.log(error.message);

    }

}

run();
