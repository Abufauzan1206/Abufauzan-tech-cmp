/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-002
 * File: membershipApplicationEngine.js
 * Version: 1.0.0
 * Membership Application Foundation
 * =====================================================
 */

import { CMPIdService } from "./idService.js";
import { CMPRepositoryManager } from "../repositories/repositoryManager.js";

export class CMPMembershipApplicationEngine {

    /**
     * Create a pending membership application.
     *
     * This is intentionally separate from
     * CMPMemberEngine.register(), which creates an
     * active member directly for authorized staff.
     */
    static async submit(application) {

        if (!application || typeof application !== "object") {
            throw new TypeError(
                "Membership application data is required."
            );
        }

        if (!application.cooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        if (!application.firstName) {
            throw new Error(
                "Applicant first name is required."
            );
        }

        if (!application.lastName) {
            throw new Error(
                "Applicant last name is required."
            );
        }

        if (!application.phone) {
            throw new Error(
                "Applicant phone is required."
            );
        }

        const cooperativeId =
            typeof application.cooperativeId === "string"
                ? application.cooperativeId.trim()
                : "";

        const firstName =
            typeof application.firstName === "string"
                ? application.firstName.trim()
                : "";

        const middleName =
            typeof application.middleName === "string"
                ? application.middleName.trim()
                : "";

        const lastName =
            typeof application.lastName === "string"
                ? application.lastName.trim()
                : "";

        const phone =
            typeof application.phone === "string"
                ? application.phone.trim()
                : "";

        const email =
            typeof application.email === "string"
                ? application.email.trim()
                : "";

        if (!cooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        if (!firstName) {
            throw new Error(
                "Applicant first name is required."
            );
        }

        if (!lastName) {
            throw new Error(
                "Applicant last name is required."
            );
        }

        if (!phone) {
            throw new Error(
                "Applicant phone is required."
            );
        }

        const newApplication = {
            applicationId: CMPIdService.generate("MAP"),
            cooperativeId,
            firstName,
            ...(middleName ? { middleName } : {}),
            lastName,
            phone,
            ...(email ? { email } : {}),
            status: "pending",
            submittedAt: new Date()
        };

        await CMPRepositoryManager
            .membershipApplication
            .create(newApplication);

        return newApplication;
    }

    /**
     * Retrieve one membership application.
     */
    static async getById(applicationId) {
        return await CMPRepositoryManager
            .membershipApplication
            .findById(applicationId);
    }

    /**
     * Retrieve all membership applications.
     */
    static async getAll() {
        return await CMPRepositoryManager
            .membershipApplication
            .findAll();
    }

    /**
     * Retrieve membership applications for one cooperative.
     */
    static async getByCooperativeId(cooperativeId) {
        if (typeof cooperativeId !== "string") {
            throw new TypeError(
                "Cooperative ID must be a string."
            );
        }

        const normalizedCooperativeId =
            cooperativeId.trim();

        if (!normalizedCooperativeId) {
            throw new Error(
                "Cooperative ID is required."
            );
        }

        return await CMPRepositoryManager
            .membershipApplication
            .findAllByCooperativeId(
                normalizedCooperativeId
            );
    }
}
