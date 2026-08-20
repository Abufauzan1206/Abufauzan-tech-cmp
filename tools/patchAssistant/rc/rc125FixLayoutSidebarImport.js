/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC125 - FIX LAYOUT SIDEBAR IMPORT
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/layout.js",
        mode: "regex",
        search: `import \\{ buildSidebar \\} from "\\./sidebar\\.js";`,
        replace: `import { buildSidebar } from "./navigation/sidebar.js";`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC125 - FIX LAYOUT SIDEBAR IMPORT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC125 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC125 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC125 PATCH COMPLETE");
    console.log("=========================================");
}

run();
