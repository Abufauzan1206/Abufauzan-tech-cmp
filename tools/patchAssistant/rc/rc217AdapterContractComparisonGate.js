/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC217 — ADAPTER CONTRACT COMPARISON GATE
 *
 * Purpose:
 * Verify that Memory and Firebase adapters expose
 * the same canonical repository adapter contract
 * before introducing duplicate-query capabilities.
 * =====================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");

const memoryPath =
    path.join(ROOT, "js/adapters/memoryAdapter.js");

const firebasePath =
    path.join(ROOT, "js/adapters/firebaseAdapter.js");

const databasePath =
    path.join(ROOT, "js/adapters/databaseAdapter.js");

const memorySource =
    fs.readFileSync(memoryPath, "utf8");

const firebaseSource =
    fs.readFileSync(firebasePath, "utf8");

const databaseSource =
    fs.readFileSync(databasePath, "utf8");

const canonicalMethods = [
    "create",
    "findById",
    "findAll",
    "update",
    "delete"
];

function assertContains(label, source, text) {
    if (!source.includes(text)) {
        throw new Error(
            `FAIL — ${label}: missing ${text}`
        );
    }

    console.log(
        `PASS — ${label}: ${text}`
    );
}

function assertMethodContract(label, source) {
    for (const method of canonicalMethods) {
        const pattern =
            new RegExp(`async\\s+${method}\\s*\\(`);

        if (!pattern.test(source)) {
            throw new Error(
                `FAIL — ${label}: missing async ${method}()`
            );
        }

        console.log(
            `PASS — ${label}: async ${method}()`
        );
    }
}

try {

    console.log("==================================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC217 — ADAPTER CONTRACT COMPARISON GATE");
    console.log("==================================================");

    console.log("");
    console.log("----- CANONICAL DATABASE ADAPTER -----");

    assertContains(
        "database adapter",
        databaseSource,
        "export class CMPDatabaseAdapter"
    );

    assertMethodContract(
        "database adapter",
        databaseSource
    );

    console.log("");
    console.log("----- MEMORY ADAPTER CONTRACT -----");

    assertContains(
        "memory adapter",
        memorySource,
        "export class CMPMemoryAdapter"
    );

    assertMethodContract(
        "memory adapter",
        memorySource
    );

    console.log("");
    console.log("----- FIREBASE ADAPTER CONTRACT -----");

    assertContains(
        "firebase adapter",
        firebaseSource,
        "export class CMPFirebaseAdapter"
    );

    assertMethodContract(
        "firebase adapter",
        firebaseSource
    );

    console.log("");
    console.log("----- CROSS-ADAPTER CONTRACT -----");

    for (const method of canonicalMethods) {

        const memoryHas =
            new RegExp(`async\\s+${method}\\s*\\(`)
                .test(memorySource);

        const firebaseHas =
            new RegExp(`async\\s+${method}\\s*\\(`)
                .test(firebaseSource);

        if (!memoryHas || !firebaseHas) {
            throw new Error(
                `Adapter contract mismatch for ${method}().`
            );
        }

        console.log(
            `PASS — both adapters implement ${method}()`
        );
    }

    console.log("");
    console.log("----- DUPLICATE-QUERY BASELINE -----");

    const duplicateQueryTerms = [
        "findBy",
        "findOne",
        "exists"
    ];

    const combinedSource =
        memorySource + "\n" +
        firebaseSource + "\n" +
        databaseSource;

    for (const term of duplicateQueryTerms) {

        if (combinedSource.includes(term)) {
            console.log(
                `OBSERVED — adapter source contains ${term}`
            );
        } else {
            console.log(
                `PASS — no canonical ${term}() contract exists yet`
            );
        }
    }

    console.log("");
    console.log("==================================================");
    console.log(
        "RC217 ADAPTER CONTRACT COMPARISON: PASS"
    );
    console.log("==================================================");

} catch (error) {

    console.error("");
    console.error("==================================================");
    console.error(
        "RC217 ADAPTER CONTRACT COMPARISON: FAIL"
    );
    console.error("==================================================");
    console.error(
        error?.message || error
    );

    process.exitCode = 1;
}
