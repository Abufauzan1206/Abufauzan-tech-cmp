/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-001
 *
 * File: baseRepository.js
 * Version: 1.0.0
 * =====================================================
 */

export class CMPBaseRepository {

    constructor() {

        this.records = [];

    }

    /**
     * Save a record
     */
    save(record) {

        this.records.push(record);

        return record;

    }

    /**
     * Get all records
     */
    getAll() {

        return [...this.records];

    }

    /**
     * Find a record
     */
    find(predicate) {

        return this.records.find(predicate);

    }

    /**
     * Remove a record
     */
    remove(predicate) {

        this.records =
            this.records.filter(
                record => !predicate(record)
            );

    }
    
    /**
 * Count records
 */
count() {

    return this.records.length;

}

/**
 * Remove all records
 */
clear() {

    this.records = [];

}

/**
 * Check if a record exists
 */
exists(predicate) {

    return this.records.some(predicate);

}

/**
 * Update a record
 */
update(predicate, updater) {

    const index =
        this.records.findIndex(predicate);

    if (index === -1) {

        return null;

    }

    this.records[index] = {

        ...this.records[index],

        ...updater

    };

    return this.records[index];

}

/**
 * Find a record by ID
 */
findById(idField, idValue) {

    return this.records.find(

        record =>

            record[idField] === idValue

    );

}

}