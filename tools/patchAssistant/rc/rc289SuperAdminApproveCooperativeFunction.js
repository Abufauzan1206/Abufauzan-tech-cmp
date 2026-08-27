/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #289
 *
 * Super Admin approval -> approveCooperative callable
 *
 * Purpose:
 * Route cooperative approval through the secure Cloud
 * Function instead of directly changing status to active.
 *
 * Reject behavior remains unchanged.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
  {
    path: "js/super-admin.js",
    mode: "exact",
    search:
`import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";`,
    replace:
`import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";`
  },
  {
    path: "js/super-admin.js",
    mode: "exact",
    search:
`import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";`,
    replace:
`import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const functions = getFunctions();
const approveCooperative = httpsCallable(
    functions,
    "approveCooperative"
);`
  },
  {
    path: "js/super-admin.js",
    mode: "exact",
    search:
`card.querySelector('[data-action="approve"]')
                .addEventListener("click", () =>
                    updateCooperativeStatus(application.id, "active")
                );`,
    replace:
`card.querySelector('[data-action="approve"]')
                .addEventListener("click", () =>
                    approveCooperativeApplication(application.id)
                );`
  },
  {
    path: "js/super-admin.js",
    mode: "exact",
    search:
`async function updateCooperativeStatus(cooperativeId, status) {`,
    replace:
`async function approveCooperativeApplication(cooperativeId) {
    const confirmed = window.confirm(
        "Are you sure you want to approve this cooperative application?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const result = await approveCooperative({
            cooperativeId
        });

        const data = result.data || {};

        alert(
            data.message ||
            "Cooperative application approved."
        );

        await loadCooperativeApplications();

    } catch (error) {
        console.error(
            "Cooperative approval error:",
            error
        );

        alert(
            "Unable to approve cooperative application: " +
            (error.message || "Unknown error.")
        );
    }
}

async function updateCooperativeStatus(cooperativeId, status) {`
  }
];

async function run() {
  console.log("=========================================");
  console.log("ABUFAUZAN TECH CMP");
  console.log("RC289 - SUPER ADMIN APPROVE FUNCTION");
  console.log("=========================================");

  const result = await transaction(patches);

  console.log(
    "RC289 TRANSACTION RESULT:"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );

  if (!result.success) {
    process.exitCode = 1;
    console.log("=========================================");
    console.log("RC289 PATCH FAIL");
    console.log("=========================================");
    return;
  }

  console.log("=========================================");
  console.log("RC289 PATCH COMPLETE");
  console.log("=========================================");
}

run();
