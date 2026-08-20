import { patch } from "../patchEngine.js";

const file =
    "js/business/memberEngine.js";

async function run() {

    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC031 - FIX MEMBER ENGINE FLOW");
    console.log("=========================================");

    try {

        const result = await patch({

            path: file,

            search:
`return newMember;

    CMPAuditService.log(`,

            replace:
`    CMPAuditService.log(`

        });

        console.log("RC031 PATCH: PASS");
        console.log(result);

    } catch (error) {

        console.log("RC031 PATCH: FAIL");
        console.log(error.message);

    }

}

run();
