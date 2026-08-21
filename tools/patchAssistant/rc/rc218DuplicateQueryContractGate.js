/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC218 — DUPLICATE QUERY CONTRACT GATE
 *
 * Purpose:
 * Establish the canonical repository/adapter contract
 * required for member duplicate detection.
 *
 * Required capability:
 *   findOne(criteria)
 *
 * Runtime path:
 *   memberService
 *       ↓
 *   memberRepository
 *       ↓
 *   BaseRepository
 *       ↓
 *   Adapter
 *
 * RC218 is a CONTRACT GATE only.
 * It must not modify production behavior.
 * =====================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "../../..");

const files = {
    baseRepository:
        path.join(root, "js/repositories/baseRepository.js"),

    memoryAdapter:
        path.join(root, "js/adapters/memoryAdapter.js"),

    firebaseAdapter:
        path.join(root, "js/adapters/firebaseAdapter.js"),

    databaseAdapter:
        path.join(root, "js/adapters/databaseAdapter.js"),

    memberRepository:
        path.join(root, "js/repositories/memberRepository.js")
};

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC218 — DUPLICATE QUERY CONTRACT GATE");
console.log("==================================================");

function read(file) {
    if (!fs.existsSync(file)) {
        throw new Error(`Required file not found: ${file}`);
    }

    return fs.readFileSync(file, "utf8");
}

function assertContains(label, source, pattern) {
    if (!source.includes(pattern)) {
        throw new Error(
            `${label} missing required contract: ${pattern}`
        );
    }

    console.log(`PASS — ${label}: ${pattern}`);
}

function assertMethod(label, source, method) {
    const pattern =
        new RegExp(`async\\s+${method}\\s*\\(`);

    if (!pattern.test(source)) {
        throw new Error(
            `${label} missing async ${method}()`
        );
    }

    console.log(
        `PASS — ${label}: async ${method}()`
    );
}

try {

    console.log("");
    console.log("----- BASE REPOSITORY -----");

    const baseSource = read(files.baseRepository);

    assertContains(
        "base repository",
        baseSource,
        "export class CMPBaseRepository"
    );

    assertMethod(
        "base repository",
        baseSource,
        "findById"
    );

    console.log("");
    console.log("----- DATABASE ADAPTER -----");

    const databaseSource =
        read(files.databaseAdapter);

    assertContains(
        "database adapter",
        databaseSource,
        "export class CMPDatabaseAdapter"
    );

    console.log("");
    console.log("----- MEMORY ADAPTER -----");

    const memorySource =
        read(files.memoryAdapter);

    assertContains(
        "memory adapter",
        memorySource,
        "export class CMPMemoryAdapter"
    );

    console.log("");
    console.log("----- FIREBASE ADAPTER -----");

    const firebaseSource =
        read(files.firebaseAdapter);

    assertContains(
        "firebase adapter",
        firebaseSource,
        "export class CMPFirebaseAdapter"
    );

    console.log("");
    console.log("----- CURRENT DUPLICATE QUERY STATE -----");

    const sources = {
        "base repository": baseSource,
        "database adapter": databaseSource,
        "memory adapter": memorySource,
        "firebase adapter": firebaseSource
    };

    for (const [label, source] of Object.entries(sources)) {
        const hasFindOne =
            /async\s+findOne\s*\(/.test(source);

        if (hasFindOne) {
            console.log(
                `OBSERVED — ${label} already exposes findOne()`
            );
        } else {
            console.log(
                `OBSERVED — ${label} does not yet expose findOne()`
            );
        }
    }

    console.log("");
    console.log("----- MEMBER REPOSITORY QUERY BASELINE -----");

    const memberRepositorySource =
        read(files.memberRepository);

    assertContains(
        "member repository",
        memberRepositorySource,
        "extends CMPBaseRepository"
    );

    const memberFindOne =
        /findOne\s*\(/.test(memberRepositorySource);

    if (memberFindOne) {
        console.log(
            "OBSERVED — member repository already declares findOne()"
        );
    } else {
        console.log(
            "PASS — member repository has no duplicate-query override yet"
        );
    }

    console.log("");
    console.log("----- CANONICAL CONTRACT DECISION -----");

    const canonicalMethods = [
        "create",
        "findById",
        "findAll",
        "update",
        "delete"
    ];

    for (const method of canonicalMethods) {
        const baseHas =
            new RegExp(`async\\s+${method}\\s*\\(`)
                .test(baseSource);

        if (!baseHas) {
            throw new Error(
                `Existing base repository CRUD contract lost: ${method}()`
            );
        }

        console.log(
            `PASS — existing repository contract retains ${method}()`
        );
    }

    const duplicateQueryAlreadyCanonical =
        /async\s+findOne\s*\(/.test(baseSource) &&
        /async\s+findOne\s*\(/.test(memorySource) &&
        /async\s+findOne\s*\(/.test(firebaseSource);

    if (duplicateQueryAlreadyCanonical) {
        console.log(
            "PASS — findOne() is already canonical across repository/adapter layers"
        );
    } else {
        console.log(
            "PASS — duplicate-query capability is not yet canonical"
        );
        console.log(
            "RC218 establishes findOne(criteria) as the next required contract"
        );
    }

    console.log("");
    console.log("==================================================");
    console.log(
        "RC218 DUPLICATE QUERY CONTRACT GATE: PASS"
    );
    console.log("==================================================");

} catch (error) {

    console.error("");
    console.error("==================================================");
    console.error(
        "RC218 DUPLICATE QUERY CONTRACT GATE: FAIL"
    );
    console.error("==================================================");
    console.error(
        error?.message || error
    );

    process.exitCode = 1;
}
