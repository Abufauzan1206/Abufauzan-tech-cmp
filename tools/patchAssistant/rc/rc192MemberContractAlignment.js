/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC192 — MEMBER CONTRACT ALIGNMENT PATCH
 *
 * Purpose:
 * Align the registration application adapter with the
 * existing Member Engine validation contract:
 *
 *   firstName
 *   lastName
 *   phone
 *   email
 *
 * Production target:
 *   modules/members/registration/app.js
 *
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "modules/members/registration/app.js",
        mode: "regex",
        search: `const fullName =\\s*document\\s*\\.getElementById\\("fullName"\\)\\s*\\?\\.value\\s*\\.trim\\(\\);`,
        replace: `const fullName =
        document
            .getElementById("fullName")
            ?.value
            .trim();

    const nameParts = fullName
        ? fullName.split(/\\s+/)
        : [];

    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ");`
    },
    {
        path: "modules/members/registration/app.js",
        mode: "regex",
        search: `const phoneNumber =\\s*document\\s*\\.getElementById\\("phoneNumber"\\)\\s*\\?\\.value\\s*\\.trim\\(\\);`,
        replace: `const phone =
        document
            .getElementById("phoneNumber")
            ?.value
            .trim();

    const phoneNumber = phone;`
    },
    {
        path: "modules/members/registration/app.js",
        mode: "regex",
        search: `if \\(!fullName \\|\\| !phoneNumber\\) \\{`,
        replace: `if (!firstName || !lastName || !phone) {`
    },
    {
        path: "modules/members/registration/app.js",
        mode: "exact",
        search: `await registerMember({
                fullName,
                phoneNumber,
                email
            });`,
        replace: `await registerMember({
                firstName,
                lastName,
                phone,
                email
            });`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC192 — MEMBER CONTRACT ALIGNMENT PATCH");
console.log("==================================================");
console.log("PATCH COUNT:", patches.length);
console.log("");

const result = await transaction(patches);

console.log("TRANSACTION RESULT:");
console.log(JSON.stringify(result, null, 2));

if (!result.success) {
    process.exitCode = 1;
}

console.log("==================================================");
console.log(
    result.success
        ? "RC192 MEMBER CONTRACT ALIGNMENT: PASS"
        : "RC192 MEMBER CONTRACT ALIGNMENT: FAIL"
);
console.log("==================================================");
