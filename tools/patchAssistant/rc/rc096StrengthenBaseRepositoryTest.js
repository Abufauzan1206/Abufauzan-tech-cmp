/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC096 - STRENGTHEN BASE REPOSITORY VERIFICATION
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBaseRepository.js",
        mode: "replace",

        search: `import { CMPBaseRepository } from "./js/repositories/baseRepository.js";`,

        replace: `import { CMPBaseRepository } from "./js/repositories/baseRepository.js";
import { CMPMemoryAdapter } from "./js/adapters/memoryAdapter.js";`
    },
    {
        path: "testBaseRepository.js",
        mode: "replace",

        search: `const repository = new CMPBaseRepository();`,

        replace: `const adapter = new CMPMemoryAdapter("baseRepositoryTest");
adapter.clear("baseRepositoryTest");

const repository = new CMPBaseRepository(adapter);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC096 - STRENGTHEN BASE REPOSITORY TEST");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC096 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC096 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC096 PATCH COMPLETE");
    console.log("=========================================");
}

run();
