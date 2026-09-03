import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/services/membershipApplicationService.js",
        search: `import { CMPMembershipApplicationEngine } from "../business/membershipApplicationEngine.js";`,
        replace: `import { CMPMembershipApplicationEngine } from "../business/membershipApplicationEngine.js";
import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

const submitMembershipApplicationCallable =
    httpsCallable(
        functions,
        "submitMembershipApplication"
    );`
    },
    {
        path: "js/services/membershipApplicationService.js",
        search: `export async function submitMembershipApplication(data) {
    return await CMPMembershipApplicationEngine.submit(data);
}`,
        replace: `export async function submitMembershipApplication(data) {
    if (!data || typeof data !== "object") {
        throw new TypeError(
            "Membership application data is required."
        );
    }

    const result =
        await submitMembershipApplicationCallable(data);

    if (!result?.data?.success) {
        throw new Error(
            result?.data?.message ||
            "Unable to submit membership application."
        );
    }

    return result.data;
}`
    }
];

const result = await transaction(patches);

console.log("PATCH ENGINE RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
    throw new Error(
        "RC406-D67 PUBLIC MEMBERSHIP SUBMISSION SERVICE: FAIL"
    );
}

console.log(
    "RC406-D67 PUBLIC MEMBERSHIP SUBMISSION SERVICE: PASS"
);
