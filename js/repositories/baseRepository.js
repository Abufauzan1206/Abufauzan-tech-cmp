/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 * Repository Layer
 *
 * File: baseRepository.js
 * Module: RP-001
 * Version: 1.0.0
 * =====================================================
 */


export class CMPBaseRepository {


    constructor() {

        this.records = [];

        this.sequence = 1;

    }



    create(data) {

        const record = {

            id: this.sequence++,

            ...data,

            createdAt: new Date()

        };


        this.records.push(record);


        return record;

    }



    findById(id) {

        return this.records.find(
            record => record.id === id
        );

    }



    findAll() {

        return this.records;

    }



    update(id, updates) {

        const record =
            this.findById(id);


        if (!record) {

            return null;

        }


        Object.assign(
            record,
            updates
        );


        return record;

    }



    delete(id) {

        const index =
            this.records.findIndex(
                record => record.id === id
            );


        if (index === -1) {

            return false;

        }


        this.records.splice(index,1);


        return true;

    }

}
