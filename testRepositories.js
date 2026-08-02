import { CMPRepositoryManager } from "./js/repositories/repositoryManager.js";

console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" REPOSITORY BEHAVIOR TEST");
console.log("=========================================");

console.log("");

const repositories = [
    "member",
    "contribution",
    "transaction",
    "ledger",
    "journal",
    "chartOfAccounts"
];


repositories.forEach((repo) => {

    console.log(
        repo + " Repository:"
    );

    console.log(
        CMPRepositoryManager.get(repo).constructor.name
    );

    console.log("");

});


console.log("Repository Count:");

console.log(
    CMPRepositoryManager.getAll().size
);


console.log("");

console.log("=========================================");
console.log(" REPOSITORY BEHAVIOR TEST COMPLETE");
console.log("=========================================");
