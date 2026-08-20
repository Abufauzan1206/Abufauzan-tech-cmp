import { CMPBaseRepository } from "./js/repositories/baseRepository.js";
import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";


const adapter = new CMPMemoryAdapter("baseRepositoryTest");
CMPMemoryAdapter.clear("baseRepositoryTest");

const repository = new CMPBaseRepository(adapter);


console.log("");

console.log("=========================================");
console.log(" ABUFAUZAN TECH CMP");
console.log(" BASE REPOSITORY TEST");
console.log("=========================================");


const member = await repository.create({
    name: "Ahmad",
    role: "MEMBER",
    status: "ACTIVE"
});

if (!member || !member.id) {
    throw new Error("Create operation failed.");
}

console.log("");
console.log("Created Record:");
console.log(member);

const foundMember =
    await repository.findById(member.id);

if (!foundMember || foundMember.id !== member.id) {
    throw new Error("Find By ID operation failed.");
}

console.log("");
console.log("Find By ID:");
console.log(foundMember);

const allMembers =
    await repository.findAll();

if (
    !Array.isArray(allMembers) ||
    allMembers.length !== 1
) {
    throw new Error("Find All operation failed.");
}

console.log("");
console.log("All Records:");
console.table(allMembers);

const updatedMember =
    await repository.update(
        member.id,
        {
            status: "INACTIVE"
        }
    );

if (
    !updatedMember ||
    updatedMember.status !== "INACTIVE"
) {
    throw new Error("Update operation failed.");
}

const verifiedUpdate =
    await repository.findById(member.id);

if (
    !verifiedUpdate ||
    verifiedUpdate.status !== "INACTIVE"
) {
    throw new Error(
        "Update verification failed."
    );
}

console.log("");
console.log("After Update:");
console.log(verifiedUpdate);

const deleted =
    await repository.delete(member.id);

if (deleted !== true) {
    throw new Error("Delete operation failed.");
}

const remaining =
    await repository.findAll();

if (
    !Array.isArray(remaining) ||
    remaining.length !== 0
) {
    throw new Error(
        "Delete verification failed."
    );
}

console.log("");
console.log("After Delete:");
console.log(remaining);

console.log("");
console.log("Create Verification: PASS");
console.log("Find By ID Verification: PASS");
console.log("Find All Verification: PASS");
console.log("Update Verification: PASS");
console.log("Delete Verification: PASS");
console.log("Base Repository Verification: PASS");



console.log("");




console.log("");

console.log("=========================================");

