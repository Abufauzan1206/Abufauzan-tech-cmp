/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC213 — MEMBER REGISTRATION RUNTIME ISOLATION GATE
 *
 * Purpose:
 * Verify that multiple registered members remain
 * isolated in persistence and retrieval.
 * =====================================================
 */

import {
    registerMember,
    getMemberById,
    deleteMember
} from "../../../js/services/memberService.js";

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC213 — MEMBER REGISTRATION RUNTIME ISOLATION GATE");
console.log("==================================================");

const members = [];

try {
    console.log("");
    console.log("----- STEP 1: REGISTER ISOLATED MEMBERS -----");

    const cases = [
        {
            firstName: "RC213-A",
            lastName: "IsolationOne",
            phone: "08000000213",
            email: "rc213a@test.local"
        },
        {
            firstName: "RC213-B",
            lastName: "IsolationTwo",
            phone: "08000000214",
            email: "rc213b@test.local"
        }
    ];

    for (const data of cases) {
        const member = await registerMember(data);

        if (!member?.memberId) {
            throw new Error(
                "Registration failed to return memberId."
            );
        }

        members.push(member);

        console.log(
            `PASS — registered ${member.memberId}`
        );
    }

    console.log("");
    console.log("----- STEP 2: VERIFY IDENTITY ISOLATION -----");

    if (members[0].memberId === members[1].memberId) {
        throw new Error(
            "Two different registrations received the same memberId."
        );
    }

    console.log(
        "PASS — registered members have distinct memberIds"
    );

    console.log("");
    console.log("----- STEP 3: VERIFY CROSS-RETRIEVAL ISOLATION -----");

    const firstPersisted =
        await getMemberById(members[0].memberId);

    const secondPersisted =
        await getMemberById(members[1].memberId);

    if (!firstPersisted || !secondPersisted) {
        throw new Error(
            "One or more registered members could not be retrieved."
        );
    }

    if (firstPersisted.id !== members[0].memberId) {
        throw new Error(
            "First member retrieval returned incorrect document identity."
        );
    }

    if (secondPersisted.id !== members[1].memberId) {
        throw new Error(
            "Second member retrieval returned incorrect document identity."
        );
    }

    if (
        firstPersisted.memberId !==
        members[0].memberId
    ) {
        throw new Error(
            "First member persisted memberId mismatch."
        );
    }

    if (
        secondPersisted.memberId !==
        members[1].memberId
    ) {
        throw new Error(
            "Second member persisted memberId mismatch."
        );
    }

    console.log(
        "PASS — first member retrieves its own document"
    );

    console.log(
        "PASS — second member retrieves its own document"
    );

    console.log("");
    console.log("----- STEP 4: VERIFY DATA ISOLATION -----");

    const fields = [
        "firstName",
        "lastName",
        "phone",
        "email"
    ];

    for (const field of fields) {
        if (
            firstPersisted[field] !==
            members[0][field]
        ) {
            throw new Error(
                `First member ${field} crossed registration boundary.`
            );
        }

        if (
            secondPersisted[field] !==
            members[1][field]
        ) {
            throw new Error(
                `Second member ${field} crossed registration boundary.`
            );
        }
    }

    if (
        firstPersisted.firstName ===
        secondPersisted.firstName
    ) {
        throw new Error(
            "First and second member firstName values unexpectedly match."
        );
    }

    if (
        firstPersisted.email ===
        secondPersisted.email
    ) {
        throw new Error(
            "First and second member email values unexpectedly match."
        );
    }

    console.log(
        "PASS — first member data remains isolated"
    );

    console.log(
        "PASS — second member data remains isolated"
    );

    console.log("");
    console.log("----- STEP 5: CLEANUP -----");

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
        "RC213 MEMBER REGISTRATION RUNTIME ISOLATION: PASS"
    );
    console.log("==================================================");

} catch (error) {

    console.error("");
    console.error("==================================================");
    console.error(
        "RC213 MEMBER REGISTRATION RUNTIME ISOLATION: FAIL"
    );
    console.error("==================================================");
    console.error(
        error?.message || error
    );

    for (const member of members) {
        try {
            await deleteMember(member.memberId);
            console.log(
                `RC213 CLEANUP: deleted ${member.memberId}`
            );
        } catch (cleanupError) {
            console.error(
                "RC213 CLEANUP FAILED:",
                cleanupError?.message || cleanupError
            );
        }
    }

    process.exitCode = 1;
}
