/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Core Module: CMP-048
 *
 * File: schedulerService.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPSchedulerService {

    static jobs = {};

    /**
     * Schedule a repeating task
     */
    static every(name, callback, interval) {

        this.stop(name);

        this.jobs[name] = setInterval(

            callback,

            interval

        );

    }

    /**
     * Schedule a one-time task
     */
    static once(name, callback, delay) {

        this.stop(name);

        this.jobs[name] = setTimeout(() => {

            callback();

            delete this.jobs[name];

        }, delay);

    }

    /**
     * Stop a scheduled task
     */
    static stop(name) {

        if (!this.jobs[name]) {

            return;

        }

        clearInterval(this.jobs[name]);

        clearTimeout(this.jobs[name]);

        delete this.jobs[name];

    }

    /**
     * Stop all scheduled tasks
     */
    static stopAll() {

        Object.keys(this.jobs).forEach(name => {

            this.stop(name);

        });

    }
    
    /**
 * Check if a job is running
 */
static isRunning(name) {

    return name in this.jobs;

}

/**
 * Get all scheduled jobs
 */
static getJobs() {

    return Object.keys(this.jobs);

}

/**
 * Count running jobs
 */
static count() {

    return Object.keys(this.jobs).length;

}

}