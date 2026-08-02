/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Business Module: BM-025
 *
 * File: auditTrailEngine.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPAuditTrailEngine {

    static logs = [];

    static record({

        user = "SYSTEM",

        action,

        module,

        reference = "",

        description = ""

    }) {

        const entry = {

            id: this.logs.length + 1,

            user,

            action,

            module,

            reference,

            description,

            timestamp: new Date()

        };

        this.logs.push(entry);

        return entry;

    }

    static getAll() {

        return [...this.logs];

    }

    static getByModule(module) {

        return this.logs.filter(

            log => log.module === module

        );

    }

    static getByUser(user) {

        return this.logs.filter(

            log => log.user === user

        );

    }

}
