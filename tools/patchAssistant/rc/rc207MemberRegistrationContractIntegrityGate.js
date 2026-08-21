/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC207 — MEMBER REGISTRATION CONTRACT INTEGRITY GATE
 *
 * Verifies the stabilized member-registration chain:
 * RC199 → RC201 → RC202 → RC203 → RC204 → RC205 → RC206
 *
 * This RC is verification-only.
 * No production contract is modified.
 * =====================================================
 */

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC207 — MEMBER REGISTRATION CONTRACT INTEGRITY GATE");
console.log("==================================================");

try {
    console.log("");
    console.log("----- MEMBER REGISTRATION REGRESSION GATE -----");

    await import(
        "./rc205RC204IdempotenceRegression.js?rc207=" +
        Date.now()
    );

    console.log("");
    console.log("==================================================");
    console.log("RC207 MEMBER REGISTRATION CONTRACT INTEGRITY: PASS");
    console.log("==================================================");
} catch (error) {
    console.error("");
    console.error("==================================================");
    console.error("RC207 MEMBER REGISTRATION CONTRACT INTEGRITY: FAIL");
    console.error("==================================================");
    console.error(error.stack || error.message);
    process.exit(1);
}
