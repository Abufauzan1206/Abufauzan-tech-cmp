import { CMPBaseRepository } from "./js/repositories/baseRepository.js";


const repository = new CMPBaseRepository();


console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" BASE REPOSITORY TEST");
console.log("=========================================");


const member = repository.create({

    name: "Ahmad",

    role: "MEMBER",

    status: "ACTIVE"

});


console.log("");

console.log("Created Record:");

console.log(member);



console.log("");

console.log("Find By ID:");

console.log(
    repository.findById(member.id)
);



console.log("");

console.log("All Records:");

console.table(
    repository.findAll()
);



repository.update(

    member.id,

    {

        status: "INACTIVE"

    }

);



console.log("");

console.log("After Update:");

console.log(
    repository.findById(member.id)
);



repository.delete(member.id);



console.log("");

console.log("After Delete:");

console.log(
    repository.findAll()
);



console.log("");

console.log("=========================================");

