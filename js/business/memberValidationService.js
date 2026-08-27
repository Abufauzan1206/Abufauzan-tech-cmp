/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-005
 *
 * File: memberValidationService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPMemberValidationService {

    /**
     * Validate member data
     */
    static validate(member) {

        if (!member.firstName?.trim()) {

            throw new Error(
                "First name is required."
            );

        }

        if (!member.lastName?.trim()) {

            throw new Error(
                "Last name is required."
            );

        }

        if (!member.phone?.trim()) {

            throw new Error(
                "Phone number is required."
            );

        }

        /*
         * RC1 OWNERSHIP CONTRACT
         *
         * Every cooperative member must belong to a
         * cooperative before reaching the repository boundary.
         */
        if (!member.cooperativeId?.trim()) {
            throw new Error(
                "Member cooperative ownership is required."
            );
        }

        return true;

    }

}