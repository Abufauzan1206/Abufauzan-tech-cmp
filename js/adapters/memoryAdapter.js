/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Adapter Layer
 *
 * File: memoryAdapter.js
 * Version: 1.0.0
 *
 * In-Memory Test Adapter
 * =====================================================
 */


export class CMPMemoryAdapter {

    static stores = new Map();


    constructor(
        collectionName
    ) {

        this.collectionName =
            collectionName;

        if (
            !CMPMemoryAdapter.stores.has(
                collectionName
            )
        ) {

            CMPMemoryAdapter.stores.set(
                collectionName,
                []
            );

        }

        this.data =
            CMPMemoryAdapter.stores.get(
                collectionName
            );

    }


    static clear(
        collectionName
    ) {

        if (
            collectionName
        ) {

            CMPMemoryAdapter.stores.set(
                collectionName,
                []
            );

            return true;

        }

        CMPMemoryAdapter.stores.clear();

        return true;

    }


    async create(
        record
    ) {

        const item = {

            id:
                crypto.randomUUID(),

            ...record

        };


        this.data.push(
            item
        );


        return item;

    }


    async findById(
        id
    ) {

        return this.data.find(
            item =>
                item.id === id
        );

    }


    async findAll() {

        return this.data;

    }


    async update(
        id,
        updates
    ) {

        const index =
            this.data.findIndex(
                item =>
                    item.id === id
            );


        if (index === -1) {

            throw new Error(
                "Record not found."
            );

        }


        this.data[index] = {

            ...this.data[index],

            ...updates

        };


        return this.data[index];

    }


    async delete(
        id
    ) {

        const index =
            this.data.findIndex(
                item =>
                    item.id === id
            );


        if (index === -1) {

            throw new Error(
                "Record not found."
            );

        }


        this.data.splice(
            index,
            1
        );


        return true;

    }

}
