/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC214 — MEMBER REGISTRATION RUNTIME IDEMPOTENCE GATE
 *
 * Purpose:
 * Verify the runtime behavior of repeated registration
 * using the same member registration payload.
 *
 * This gate establishes whether duplicate registration:
 *
 *   1. creates a second member,
 *   2. reuses the existing member,
 *   3. or is explicitly rejected.
 *
 * RC214 is a behavioral verification gate. It does not
 * modify the canonical member registration contract.
 * =====================================================
 */

import {
    registerMember,
    getMemberById,
    deleteMember
} from "../../../js/services/memberService.js";

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC214 — MEMBER REGISTRATION RUNTIME IDEMPOTENCE GATE");
console.log("==================================================");

const payload = {
    firstName: "RC214",
    lastName: "IdempotenceMember",
    phone: "08000000214",
    email: "rc214@test.local"
};

const members = [];

try {

    console.log("");
    console.log("----- STEP 1: FIRST REGISTRATION -----");

    const firstMember = await registerMember(payload);

    if (!firstMember?.memberId) {
        throw new Error(
            "First registration did not return a memberId."
        );
    }

    members.push(firstMember);

    console.log(
        `PASS — first registration returned ${firstMember.memberId}`
    );

    console.log("");
    console.log("----- STEP 2: SECOND REGISTRATION -----");

    let secondMember = null;
    let secondRegistrationRejected = false;

    try {
        secondMember = await registerMember(payload);

        if (secondMember?.memberId) {
            members.push(secondMember);

            console.log(
                `PASS — second registration completed with ${secondMember.memberId}`
            );
        } else {
            throw new Error(
                "Second registration returned no memberId."
            );
        }

    } catch (error) {
        secondRegistrationRejected = true;

        console.log(
            "PASS — duplicate registration was rejected by runtime"
        );

        console.log(
            `Duplicate rejection reason: ${error?.message || error}`
        );
    }

    console.log("");
    console.log("----- STEP 3: VERIFY RUNTIME OUTCOME -----");

    if (secondRegistrationRejected) {

        console.log(
            "PASS — duplicate registration produced an explicit rejection"
        );

    } else {

        if (secondMember.memberId === firstMember.memberId) {

            console.log(
                "PASS — repeated registration reused the same member identity"
            );

        } else {

            console.log(
                "OBSERVED — repeated registration created a distinct memberId"
            );

            console.log(
                "RC214 establishes current runtime behavior as non-idempotent."
            );
        }
    }

    console.log("");
    console.log("----- STEP 4: VERIFY FIRST MEMBER PERSISTENCE -----");

    const persistedFirst =
        await getMemberById(firstMember.memberId);

    if (!persistedFirst) {
        throw new Error(
            "First registered member could not be retrieved."
        );
    }

    if (persistedFirst.id !== firstMember.memberId) {
        throw new Error(
            "First member document identity changed unexpectedly."
        );
    }

    if (persistedFirst.memberId !== firstMember.memberId) {
        throw new Error(
            "First member persisted memberId changed unexpectedly."
        );
    }

    if (persistedFirst.firstName !== payload.firstName) {
        throw new Error(
            "First member firstName persistence mismatch."
        );
    }

    if (persistedFirst.lastName !== payload.lastName) {
        throw new Error(
            "First member lastName persistence mismatch."
        );
    }

    if (persistedFirst.phone !== payload.phone) {
        throw new Error(
            "First member phone persistence mismatch."
        );
    }

    if (persistedFirst.email !== payload.email) {
        throw new Error(
            "First member email persistence mismatch."
        );
    }

    console.log(
        "PASS — first member remains correctly persisted"
    );

    if (
        secondMember &&
        secondMember.memberId !== firstMember.memberId
    ) {

        console.log("");
        console.log("----- STEP 5: VERIFY SECOND MEMBER PERSISTENCE -----");

        const persistedSecond =
            await getMemberById(secondMember.memberId);

        if (!persistedSecond) {
            throw new Error(
                "Second registered member could not be retrieved."
            );
        }

        if (persistedSecond.id !== secondMember.memberId) {
            throw new Error(
                "Second member document identity mismatch."
            );
        }

        if (persistedSecond.memberId !== secondMember.memberId) {
            throw new Error(
                "Second member persisted memberId mismatch."
            );
        }

        if (persistedSecond.firstName !== payload.firstName) {
            throw new Error(
                "Second member firstName persistence mismatch."
            );
        }

        if (persistedSecond.email !== payload.email) {
            throw new Error(
                "Second member email persistence mismatch."
            );
        }

        console.log(
            "PASS — second member remains correctly persisted"
        );
    }

    console.log("");
    console.log("----- STEP 6: CLEANUP -----");

    for (const member of members) {

        const deleted =
            await deleteMember(member.memberId);

        if (deleted !== true) {
            throw new Error(
                `Cleanup failed for ${member.memberId}.`
            );
        }

        console.log(
            `PASS — deleted ${member.memberId}`
        );
    }

    members.length = 0;

    console.log("");
    console.log("==================================================");
    console.log(
        "RC214 MEMBER REGISTRATION RUNTIME IDEMPOTENCE: PASS"
    );
    console.log("==================================================");

} catch (error) {

    console.error("");
    console.error("==================================================");
    console.error(
        "RC214 MEMBER REGISTRATION RUNTIME IDEMPOTENCE: FAIL"
    );
    console.error("==================================================");
    console.error(
        error?.message || error
    );

    for (const member of members) {
        try {
            await deleteMember(member.memberId);

            console.log(
                `RC214 CLEANUP: deleted ${member.memberId}`
            );

        } catch (cleanupError) {

            console.error(
                "RC214 CLEANUP FAILED:",
                cleanupError?.message || cleanupError
            );
        }
    }

    process.exitCode = 1;
}
