import { patch } from "../patchEngine.js";

const repairs = [
    {
        path: "tools/patchAssistant/rc/rc406D13RepairContracts.js",
        search: `import { patch } from "../patchEngine.js";`,
        replace: `import { transaction } from "../patchEngine.js";`
    },
    {
        path: "tools/patchAssistant/rc/rc406D13RepairContracts.js",
        search: `const result = await patch([`,
        replace: `const result = await transaction([`
    }
];

console.log("===============================================");
console.log("RC406-D14 REPAIR D13 RUNNER CONTRACT");
console.log("===============================================");

try {
    for (const item of repairs) {
        const result = await patch(item);

        console.log(JSON.stringify(result, null, 2));

        if (!result.success) {
            throw new Error(
                result.error || "D14 repair patch failed."
            );
        }
    }

    console.log("");
    console.log("RC406-D14 D13 RUNNER CONTRACT REPAIR: PASS");
} catch (error) {
    console.error(
        "RC406-D14 ERROR:",
        error.message
    );
    process.exitCode = 1;
}

console.log("===============================================");
