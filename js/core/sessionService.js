/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-040
 *
 * File: sessionService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPSessionService {

    static session = null;

    /**
     * Start a session
     */
    static start(sessionData) {

    this.session = {

        ...sessionData,

        loginTime:
            sessionData.loginTime ??
            new Date(),

        lastActivity:
            new Date()

    };

}

    /**
     * Get current session
     */
    static get() {

        return this.session;

    }
    
    /**
 * Update last activity time
 */
static touch() {

    if (this.session) {

        this.session.lastActivity =
            new Date();

    }

}

/**
 * Get session duration (milliseconds)
 */
static getDuration() {

    if (!this.session) {

        return 0;

    }

    return (
        new Date() -
        new Date(this.session.loginTime)
    );

}

    /**
     * Check if a session exists
     */
    static hasSession() {

        return this.session !== null;

    }

    /**
     * End the session
     */
    static end() {

        this.session = null;

    }

}