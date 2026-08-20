/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC127A - FIX ROLE AUTHORIZATION TEST IMPORT
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/test/testRoleAuthorization.js",
        mode: "exact",
        search: 'from "../../js/components/roleAuthorization.js";',
        replace: 'from "../../../js/components/roleAuthorization.js";'
    }
];

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC127A - FIX ROLE AUTHORIZATION TEST IMPORT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC127A TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {

        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC127A PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC127A PATCH COMPLETE");
    console.log("=========================================");
}

run();
