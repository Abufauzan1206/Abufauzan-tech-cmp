import { CMPRepositoryManager } from "./js/repositories/repositoryManager.js";


console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" REPOSITORY REGISTRY TEST");
console.log("=========================================");


console.log("");

console.log("Get Transaction Repository:");

console.log(
    CMPRepositoryManager.get("transaction").constructor.name
);



console.log("");

console.log("Get Journal Repository:");

console.log(
    CMPRepositoryManager.get("journal").constructor.name
);



console.log("");

console.log("Registered Repositories:");

console.log(
    Array.from(
        CMPRepositoryManager.getAll().keys()
    )
);



console.log("");

console.log("Duplicate Registration Test:");

console.log(

    CMPRepositoryManager.register(

        "transaction",

        CMPRepositoryManager.transaction

    )

);



console.log("");

console.log("=========================================");

