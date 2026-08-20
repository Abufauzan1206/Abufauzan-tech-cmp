/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: rc039SharedMemoryCollectionsPatch.js
 * Version: 1.0.0
 *
 * RC039 - Shared Memory Collections Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/adapters/memoryAdapter.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC039 - SHARED MEMORY COLLECTIONS PATCH"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                mode: "regex",

                search:
`export class CMPMemoryAdapter \\{[\\s\\S]*?\\n\\}`,

                replace:
`export class CMPMemoryAdapter {

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

}`

            });


        console.log(
            "PATCH OK: shared memory collections enabled"
        );

        console.log(result);

    }
    catch (error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}

run();
