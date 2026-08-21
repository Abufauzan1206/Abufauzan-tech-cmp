/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC212 — MEMBER REGISTRATION RUNTIME REGRESSION GATE
 *
 * Purpose:
 * Verify repeated member registration remains stable,
 * produces unique canonical memberIds, persists each
 * member correctly, preserves document identity, and
 * cleans up successfully.
 * =====================================================
 */

import {
    registerMember,
    getMemberById,
    deleteMember
} from "../../../js/services/memberService.js";

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC212 — MEMBER REGISTRATION RUNTIME REGRESSION GATE");
console.log("==================================================");

const members = [];

try {
    const cases = [
        {
            firstName: "RC212-A",
            lastName: "RegressionMember",
            phone: "08000000212",
            email: "rc212a@test.local"
        },
        {
            firstName: "RC212-B",
            lastName: "RegressionMember",
            phone: "08000000213",
            email: "rc212b@test.local"
        },
        {
            firstName: "RC212-C",
            lastName: "RegressionMember",
            phone: "08000000214",
            email: "rc212c@test.local"
        }
    ];

    console.log("");
    console.log("----- STEP 1: REPEATED REGISTRATION -----");

    for (const data of cases) {
        const member = await registerMember(data);

        if (!member) {
            throw new Error(
                "Registration returned no member."
            );
        }

        if (!member.memberId) {
            throw new Error(
                "Registration returned no memberId."
            );
        }

        if (
            !/^ATC-MEM-\d{4}-\d{6}$/.test(
                member.memberId
            )
        ) {
            throw new Error(
                `Non-canonical memberId generated: ${member.memberId}`
            );
        }

        if (member.status !== "active") {
            throw new Error(
                `Expected active status, received ${member.status}`
            );
        }

        if (!(member.createdAt instanceof Date)) {
            throw new Error(
                "createdAt is not a Date instance."
            );
        }

        members.push(member);

        console.log(
            `PASS — registered ${member.memberId}`
        );
    }

    console.log("");
    console.log("----- STEP 2: MEMBER ID UNIQUENESS -----");

    const memberIds = members.map(
        member => member.memberId
    );

    const uniqueMemberIds = new Set(memberIds);

    if (uniqueMemberIds.size !== memberIds.length) {
        throw new Error(
            "Duplicate memberId detected during repeated registration."
        );
    }

    console.log(
        "PASS — all generated memberIds are unique"
    );

    console.log("");
    console.log("----- STEP 3: PERSISTENCE REGRESSION -----");

    for (const member of members) {
        const persistedMember =
            await getMemberById(member.memberId);

        if (!persistedMember) {
            throw new Error(
                `Member ${member.memberId} was not persisted.`
            );
        }

        if (persistedMember.id !== member.memberId) {
            throw new Error(
                `Document identity mismatch for ${member.memberId}.`
            );
        }

        if (
            persistedMember.memberId !==
            member.memberId
        ) {
            throw new Error(
                `Persisted memberId mismatch for ${member.memberId}.`
            );
        }

        if (
            persistedMember.firstName !==
            member.firstName
        ) {
            throw new Error(
                `firstName mismatch for ${member.memberId}.`
            );
        }

        if (
            persistedMember.lastName !==
            member.lastName
        ) {
            throw new Error(
                `lastName mismatch for ${member.memberId}.`
            );
        }

        if (
            persistedMember.phone !==
            member.phone
        ) {
            throw new Error(
                `phone mismatch for ${member.memberId}.`
            );
        }

        if (
            persistedMember.email !==
            member.email
        ) {
            throw new Error(
                `email mismatch for ${member.memberId}.`
            );
        }

        if (persistedMember.status !== "active") {
            throw new Error(
                `status mismatch for ${member.memberId}.`
            );
        }

        console.log(
            `PASS — persistence verified: ${member.memberId}`
        );
    }

    console.log("");
    console.log("----- STEP 4: CLEANUP REGRESSION -----");

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
        "RC212 MEMBER REGISTRATION RUNTIME REGRESSION: PASS"
    );
    console.log("==================================================");

} catch (error) {

    console.error("");
    console.error("==================================================");
    console.error(
        "RC212 MEMBER REGISTRATION RUNTIME REGRESSION: FAIL"
    );
    console.error("==================================================");
    console.error(
        error?.message || error
    );

    for (const member of members) {
        try {
            await deleteMember(member.memberId);
            console.log(
                `RC212 CLEANUP: deleted ${member.memberId}`
            );
        } catch (cleanupError) {
            console.error(
                "RC212 CLEANUP FAILED:",
                cleanupError?.message || cleanupError
            );
        }
    }

    process.exitCode = 1;
}
