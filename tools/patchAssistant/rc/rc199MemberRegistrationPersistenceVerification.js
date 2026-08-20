/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC199 — MEMBER REGISTRATION PERSISTENCE
 * INTEGRATION VERIFICATION
 *
 * Purpose:
 * Verify that a registered member is persisted using
 * memberId as the Firestore document identity and can
 * subsequently be retrieved using that same memberId.
 *
 * =====================================================
 */

import {
    registerMember,
    getMemberById,
    deleteMember
} from "../../../js/services/memberService.js";

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC199 — MEMBER REGISTRATION PERSISTENCE VERIFICATION");
console.log("==================================================");

let member = null;

try {

    console.log("");
    console.log("----- STEP 1: REGISTER MEMBER -----");

    member = await registerMember({
        fullName: "RC199 Test Member",
        phoneNumber: "08000000199",
        email: "rc199@test.local"
    });

    console.log("Registered Member:");
    console.log(member);

    if (!member) {
        throw new Error("Registration returned no member.");
    }

    if (!member.memberId) {
        throw new Error(
            "Registration returned no memberId."
        );
    }

    console.log("PASS — memberId generated:", member.memberId);

    console.log("");
    console.log("----- STEP 2: RETRIEVE BY MEMBER ID -----");

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
        "PASS — member retrieved by memberId"
    );

    console.log("");
    console.log("----- STEP 3: VERIFY IDENTITY -----");

    if (persistedMember.id !== member.memberId) {
        throw new Error(
            `Firestore document ID mismatch. ` +
            `Expected ${member.memberId}, ` +
            `received ${persistedMember.id}`
        );
    }

    if (persistedMember.memberId !== member.memberId) {
        throw new Error(
            `Member field mismatch. ` +
            `Expected ${member.memberId}, ` +
            `received ${persistedMember.memberId}`
        );
    }

    console.log(
        "PASS — Firestore document ID equals memberId"
    );

    console.log(
        "PASS — persisted memberId equals generated memberId"
    );

    console.log("");
    console.log("----- STEP 4: CLEANUP -----");

    const deleted =
        await deleteMember(member.memberId);

    if (deleted !== true) {
        throw new Error(
            "Cleanup delete operation failed."
        );
    }

    console.log(
        "PASS — test member deleted"
    );

    console.log("");
    console.log("==================================================");
    console.log("RC199 MEMBER REGISTRATION PERSISTENCE: PASS");
    console.log("==================================================");

} catch (error) {

    console.error("");
    console.error("==================================================");
    console.error("RC199 MEMBER REGISTRATION PERSISTENCE: FAIL");
    console.error("==================================================");

    console.error(
        error?.message || error
    );

    process.exitCode = 1;

    /*
     * Attempt cleanup if registration succeeded
     * but a later verification step failed.
     */
    if (member?.memberId) {

        try {

            await deleteMember(member.memberId);

            console.log("");
            console.log(
                "RC199 CLEANUP: TEST MEMBER DELETED"
            );

        } catch (cleanupError) {

            console.error(
                "RC199 CLEANUP FAILED:",
                cleanupError?.message || cleanupError
            );

        }
    }
}
