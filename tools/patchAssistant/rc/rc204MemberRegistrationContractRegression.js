/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC204 — MEMBER REGISTRATION CONTRACT REGRESSION
 *
 * Verifies the stabilized registration contract through:
 * RC199 → RC201 → RC202 → RC203
 * =====================================================
 */

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC204 — MEMBER REGISTRATION CONTRACT REGRESSION");
console.log("==================================================");

try {
    console.log("");
    console.log("----- RC199 VERIFICATION -----");
    await import(
        "./rc199MemberRegistrationPersistenceVerification.js?rc204=" +
        Date.now()
    );

    console.log("");
    console.log("----- RC201 VERIFICATION -----");
    await import(
        "./rc201MemberRegistrationPersistenceVerification.js?rc204=" +
        Date.now()
    );

    console.log("");
    console.log("----- RC202/RC203 IDEMPOTENT ALIGNMENT -----");
    await import(
        "./rc202AlignRC199MemberRegistrationContract.js?rc204=" +
        Date.now()
    );

    console.log("");
    console.log("==================================================");
    console.log("RC204 MEMBER REGISTRATION CONTRACT REGRESSION: PASS");
    console.log("==================================================");
} catch (error) {
    console.error("");
    console.error("==================================================");
    console.error("RC204 MEMBER REGISTRATION CONTRACT REGRESSION: FAIL");
    console.error("==================================================");
    console.error(error.stack || error.message);
    process.exit(1);
}
