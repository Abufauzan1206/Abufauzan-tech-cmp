/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Layer
 *
 * File: baseRepository.js
 * Module: RP-001
 * Version: 2.0.0
 *
 * Adapter-Based Base Repository
 * =====================================================
 */

export class CMPBaseRepository {

    constructor(adapter) {

        this.adapter = adapter;

    }


    async create(data) {

        return await this.adapter.create(data);

    }


    async findById(id) {

        return await this.adapter.findById(id);

    }


    async findAll() {

        return await this.adapter.findAll();

    }


    async update(id, data) {

        return await this.adapter.update(id, data);

    }


    async delete(id) {

        return await this.adapter.delete(id);

    }

}
