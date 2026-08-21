/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC205 — RC204 IDEMPOTENCE & REGRESSION STABILITY
 *
 * Verifies that the stabilized member-registration
 * contract regression remains repeatable and that
 * RC202/RC203 alignment remains safely idempotent.
 * =====================================================
 */

console.log("==================================================");
console.log("ABUFAUZAN TECH CMP");
console.log("RC205 — RC204 IDEMPOTENCE & REGRESSION STABILITY");
console.log("==================================================");

try {
    console.log("");
    console.log("----- RUN 1: RC204 REGRESSION -----");

    await import(
        "./rc204MemberRegistrationContractRegression.js?rc205=1&ts=" +
        Date.now()
    );

    console.log("");
    console.log("----- RUN 2: RC204 REGRESSION -----");

    await import(
        "./rc204MemberRegistrationContractRegression.js?rc205=2&ts=" +
        Date.now()
    );

    console.log("");
    console.log("==================================================");
    console.log("RC205 IDEMPOTENCE & REGRESSION STABILITY: PASS");
    console.log("==================================================");
} catch (error) {
    console.error("");
    console.error("==================================================");
    console.error("RC205 IDEMPOTENCE & REGRESSION STABILITY: FAIL");
    console.error("==================================================");
    console.error(error.stack || error.message);
    process.exit(1);
}
