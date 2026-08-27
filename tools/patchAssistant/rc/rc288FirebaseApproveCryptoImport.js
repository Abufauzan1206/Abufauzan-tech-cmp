/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #288
 *
 * Firebase approveCooperative crypto import repair
 *
 * Purpose:
 * Add the missing Node.js crypto import required by
 * crypto.randomUUID() in functions/index.js.
 *
 * This patch does not alter the RC1 architecture or
 * cooperative approval logic.
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file = "functions/index.js";

async function run() {
  console.log("=========================================");
  console.log("ABUFAUZAN TECH CMP");
  console.log("RC288 - FIREBASE APPROVE CRYPTO IMPORT");
  console.log("=========================================");

  try {
    const result = await patch({
      path: file,
      mode: "exact",
      search:
`const { setGlobalOptions } = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/https");`,
      replace:
`const crypto = require("crypto");
const { setGlobalOptions } = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/https");`
    });

    console.log("PATCH: PASS");
    console.log(result);
  } catch (error) {
    console.log("PATCH FAIL");
    console.log(error.message);
    process.exitCode = 1;
  }
}

run();
