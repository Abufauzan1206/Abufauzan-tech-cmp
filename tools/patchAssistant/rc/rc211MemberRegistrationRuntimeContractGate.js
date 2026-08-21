/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC211 — MEMBER REGISTRATION RUNTIME CONTRACT GATE
 *
 * Purpose:
 * Verify the live member registration path:
 *
 *   registerMember()
 *        ↓
 *   CMPMemberEngine.register()
 *        ↓
 *   memberRepository.create()
 *        ↓
 *   Firestore persistence
 *        ↓
 *   getMemberById()
 *
 * This gate verifies actual runtime behavior rather than
 * source-text alignment only.
 * =====================================================
 */

import {
    registerMember,
    getMemberById,
    deleteMember
} from "../../../js/services/memberService.js";

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC211 — MEMBER REGISTRATION RUNTIME CONTRACT GATE");
console.log("==================================================");

let member = null;

try {
    console.log("");
    console.log("----- STEP 1: RUNTIME REGISTRATION -----");

    member = await registerMember({
        firstName: "RC211",
        lastName: "RuntimeMember",
        phone: "08000000211",
        email: "rc211@test.local"
    });

    console.log("Registered Member:");
    console.log(member);

    if (!member) {
        throw new Error("registerMember() returned no member.");
    }

    if (!member.memberId) {
        throw new Error("Runtime registration returned no memberId.");
    }

    console.log(
        "PASS — runtime registration returned memberId:",
        member.memberId
    );

    console.log("");
    console.log("----- STEP 2: VERIFY GENERATED CONTRACT -----");

    if (typeof member.memberId !== "string") {
        throw new Error("memberId is not a string.");
    }

    if (!member.memberId.startsWith("ATC-MEM-")) {
        throw new Error(
            `Invalid memberId prefix: ${member.memberId}`
        );
    }

    if (member.status !== "active") {
        throw new Error(
            `Expected status active, received ${member.status}`
        );
    }

    if (!(member.createdAt instanceof Date)) {
        throw new Error("createdAt is not a Date instance.");
    }

    console.log("PASS — memberId format is canonical");
    console.log("PASS — member status is active");
    console.log("PASS — createdAt is present as Date");

    console.log("");
    console.log("----- STEP 3: RUNTIME PERSISTENCE -----");

    const persistedMember =
        await getMemberById(member.memberId);

    console.log("Persisted Member:");
    console.log(persistedMember);

    if (!persistedMember) {
        throw new Error(
            "getMemberById() returned no persisted member."
        );
    }

    console.log(
        "PASS — runtime persistence retrieved member"
    );

    console.log("");
    console.log("----- STEP 4: DOCUMENT IDENTITY -----");

    if (persistedMember.id !== member.memberId) {
        throw new Error(
            `Document identity mismatch. Expected ${member.memberId}, received ${persistedMember.id}`
        );
    }

    if (persistedMember.memberId !== member.memberId) {
        throw new Error(
            `Persisted memberId mismatch. Expected ${member.memberId}, received ${persistedMember.memberId}`
        );
    }

    console.log(
        "PASS — Firestore document ID equals memberId"
    );

    console.log(
        "PASS — persisted memberId equals generated memberId"
    );

    console.log("");
    console.log("----- STEP 5: MEMBER DATA CONTRACT -----");

    const expectedFields = {
        firstName: "RC211",
        lastName: "RuntimeMember",
        phone: "08000000211",
        email: "rc211@test.local",
        status: "active"
    };

    for (const [field, expected] of Object.entries(expectedFields)) {
        if (persistedMember[field] !== expected) {
            throw new Error(
                `Persisted ${field} mismatch. Expected ${expected}, received ${persistedMember[field]}`
            );
        }

        console.log(
            `PASS — persisted ${field} matches registration`
        );
    }

    console.log("");
    console.log("----- STEP 6: CLEANUP -----");

    const deleted =
        await deleteMember(member.memberId);

    if (deleted !== true) {
        throw new Error(
            "Runtime cleanup delete operation failed."
        );
    }

    console.log("PASS — runtime test member deleted");

    member = null;

    console.log("");
    console.log("==================================================");
    console.log("RC211 MEMBER REGISTRATION RUNTIME CONTRACT: PASS");
    console.log("==================================================");

} catch (error) {

    console.error("");
    console.error("==================================================");
    console.error("RC211 MEMBER REGISTRATION RUNTIME CONTRACT: FAIL");
    console.error("==================================================");
    console.error(error?.message || error);

    if (member?.memberId) {
        try {
            await deleteMember(member.memberId);
            console.log(
                "RC211 CLEANUP: TEST MEMBER DELETED"
            );
        } catch (cleanupError) {
            console.error(
                "RC211 CLEANUP FAILED:",
                cleanupError?.message || cleanupError
            );
        }
    }

    process.exitCode = 1;
}
