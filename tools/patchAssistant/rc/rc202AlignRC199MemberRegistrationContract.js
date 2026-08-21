/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC202 — ALIGN RC199 MEMBER REGISTRATION CONTRACT
 *
 * Purpose:
 * Align RC199 with the canonical member registration
 * service contract already verified by RC201.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";
import fs from "fs";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc199MemberRegistrationPersistenceVerification.js",
        mode: "replace",
        search: `member = await registerMember({
        fullName: "RC199 Test Member",
        phoneNumber: "08000000199",
        email: "rc199@test.local"
    });`,
        replace: `member = await registerMember({
        firstName: "RC199",
        lastName: "TestMember",
        phone: "08000000199",
        email: "rc199@test.local"
    });`
    }
];

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC202 — ALIGN RC199 MEMBER REGISTRATION CONTRACT");
console.log("==================================================");

try {
    const targetPath = patches[0].path;
const targetSource = fs.readFileSync(targetPath, "utf8");

const patchStillNeeded = patches.some(
    ({ search }) => targetSource.includes(search)
);

const result = patchStillNeeded
    ? await transaction(patches)
    : {
        success: true,
        count: 0,
        results: [],
        skipped: true,
        reason: "RC199 contract already aligned; no patch required."
    };

    console.log("PATCH RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result?.success) {
        throw new Error("RC202 Patch Engine reported failure.");
    }

    console.log("");
    console.log("PASS — RC199 contract aligned with canonical service contract");

    console.log("");
    console.log("----- VERIFY RC199 -----");
    const rc199 = await import(
        "./rc199MemberRegistrationPersistenceVerification.js?rc202=" +
        Date.now()
    );
    void rc199;

    console.log("");
    console.log("----- VERIFY RC201 -----");
    const rc201 = await import(
        "./rc201MemberRegistrationPersistenceVerification.js?rc202=" +
        Date.now()
    );
    void rc201;

    console.log("");
    console.log("==================================================");
    console.log("RC202 ALIGNMENT: PASS");
    console.log("==================================================");

} catch (error) {
    console.error("");
    console.error("==================================================");
    console.error("RC202 ALIGNMENT: FAIL");
    console.error("==================================================");
    console.error(error.message);
    process.exit(1);
}
