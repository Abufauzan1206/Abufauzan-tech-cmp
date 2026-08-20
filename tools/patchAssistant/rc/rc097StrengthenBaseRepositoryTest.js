/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC097 - STRENGTHEN BASE REPOSITORY TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBaseRepository.js",
        mode: "replace",
        search: `import { CMPBaseRepository } from "./js/repositories/baseRepository.js";
import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";

const adapter = new CMPMemoryAdapter("baseRepositoryTest");
adapter.clear("baseRepositoryTest");
const repository = new CMPBaseRepository(adapter);`,
        replace: `import { CMPBaseRepository } from "./js/repositories/baseRepository.js";
import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";

CMPMemoryAdapter.clear("baseRepositoryTest");
const adapter = new CMPMemoryAdapter("baseRepositoryTest");
const repository = new CMPBaseRepository(adapter);`
    },
    {
        path: "testBaseRepository.js",
        mode: "replace",
        search: `const member = repository.create({

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
);`,
        replace: `const member = await repository.create({

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
        "Updated record verification failed."
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
console.log("Base Repository Verification: PASS");`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC097 - STRENGTHEN BASE REPOSITORY TEST");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC097 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC097 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC097 PATCH COMPLETE");
    console.log("=========================================");
}

run();
