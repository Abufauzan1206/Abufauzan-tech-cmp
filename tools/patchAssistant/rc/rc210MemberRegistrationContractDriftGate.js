/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC210 — MEMBER REGISTRATION CONTRACT DRIFT GATE
 *
 * Purpose:
 * Verify that the canonical member registration contract
 * remains aligned across:
 *
 *   memberService
 *   memberEngine
 *   memberRepository
 *   baseRepository
 *   RC199 persistence contract
 *   RC201 persistence contract
 *   RC202 alignment contract
 *   RC204 regression contract
 *
 * This is a read-only integrity gate.
 * =====================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");

const files = {
    service: "js/services/memberService.js",
    engine: "js/business/memberEngine.js",
    repository: "js/repositories/memberRepository.js",
    baseRepository: "js/repositories/baseRepository.js",
    rc199: "tools/patchAssistant/rc/rc199MemberRegistrationPersistenceVerification.js",
    rc201: "tools/patchAssistant/rc/rc201MemberRegistrationPersistenceVerification.js",
    rc202: "tools/patchAssistant/rc/rc202AlignRC199MemberRegistrationContract.js",
    rc204: "tools/patchAssistant/rc/rc204MemberRegistrationContractRegression.js"
};

function read(relativePath) {
    const fullPath = path.join(ROOT, relativePath);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Missing contract file: ${relativePath}`);
    }

    return fs.readFileSync(fullPath, "utf8");
}

function assertContains(label, source, pattern) {
    if (!source.includes(pattern)) {
        throw new Error(
            `${label} missing required contract fragment: ${pattern}`
        );
    }

    console.log(`PASS — ${label}`);
}

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC210 — MEMBER REGISTRATION CONTRACT DRIFT GATE");
console.log("==================================================");

try {
    const service = read(files.service);
    const engine = read(files.engine);
    const repository = read(files.repository);
    const baseRepository = read(files.baseRepository);
    const rc199 = read(files.rc199);
    const rc201 = read(files.rc201);
    const rc202 = read(files.rc202);
    const rc204 = read(files.rc204);

    console.log("");
    console.log("----- CANONICAL SERVICE CONTRACT -----");

    assertContains(
        "memberService.registerMember()",
        service,
        "export async function registerMember(data)"
    );

    assertContains(
        "memberService delegates to CMPMemberEngine",
        service,
        "return await CMPMemberEngine.register(data)"
    );

    console.log("");
    console.log("----- MEMBER ENGINE CONTRACT -----");

    assertContains(
        "memberEngine generates memberId",
        engine,
        'CMPIdService.generate("MEM")'
    );

    assertContains(
        "memberEngine persists through RepositoryManager",
        engine,
        ".member"
    );

    assertContains(
        "memberEngine creates member",
        engine,
        ".create(newMember)"
    );

    assertContains(
        "memberEngine returns newMember",
        engine,
        "return newMember"
    );

    console.log("");
    console.log("----- MEMBER REPOSITORY CONTRACT -----");

    assertContains(
        "memberRepository extends CMPBaseRepository",
        repository,
        "extends CMPBaseRepository"
    );

    assertContains(
        "memberRepository uses members collection",
        repository,
        'firebase("members")'
    );

    console.log("");
    console.log("----- BASE REPOSITORY CONTRACT -----");

    assertContains(
        "baseRepository create delegation",
        baseRepository,
        "async create(data)"
    );

    assertContains(
        "baseRepository findById delegation",
        baseRepository,
        "async findById(id)"
    );

    assertContains(
        "baseRepository delete delegation",
        baseRepository,
        "async delete(id)"
    );

    console.log("");
    console.log("----- RC199 / RC201 CONTRACT -----");

    assertContains(
        "RC199 registration contract",
        rc199,
        "registerMember"
    );

    assertContains(
        "RC199 memberId persistence contract",
        rc199,
        "persistedMember.id !== member.memberId"
    );

    assertContains(
        "RC201 registration contract",
        rc201,
        "registerMember"
    );

    assertContains(
        "RC201 memberId persistence contract",
        rc201,
        "persistedMember.id !== member.memberId"
    );

    console.log("");
    console.log("----- RC202 / RC204 REGRESSION CONTRACT -----");

    assertContains(
        "RC202 alignment contract",
        rc202,
        "RC199"
    );

    assertContains(
        "RC204 regression contract",
        rc204,
        "RC199"
    );

    assertContains(
        "RC204 regression contract",
        rc204,
        "RC201"
    );

    console.log("");
    console.log("----- SOURCE TRACKING -----");

    for (const [key, relativePath] of Object.entries(files)) {
        const fullPath = path.join(ROOT, relativePath);
        const stat = fs.statSync(fullPath);

        console.log(
            `PASS — ${key}: ${relativePath} (${stat.size} bytes)`
        );
    }

    console.log("");
    console.log("==================================================");
    console.log("RC210 MEMBER REGISTRATION CONTRACT DRIFT: PASS");
    console.log("==================================================");

} catch (error) {
    console.error("");
    console.error("==================================================");
    console.error("RC210 MEMBER REGISTRATION CONTRACT DRIFT: FAIL");
    console.error("==================================================");
    console.error(error?.message || error);
    process.exitCode = 1;
}
