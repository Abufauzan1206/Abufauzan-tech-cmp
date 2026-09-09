import { transaction } from "../patchEngine.js";

const patches = [
  {
    path: "firestore.rules",
    mode: "regex",
    search: String.raw`match /journals/\{journalId\} \{\s*allow read, write: if isSuperAdmin\(\);\s*\}`,
    replace: `match /journals/{journalId} {
      allow read: if isSuperAdmin();
      allow create: if isSuperAdmin();
      allow update: if false;
      allow delete: if isSuperAdmin();
    }`
  },
  {
    path: "firestore.rules",
    mode: "regex",
    search: String.raw`match /ledgerBatches/\{ledgerBatchId\} \{\s*allow read, write: if isSuperAdmin\(\);\s*\}`,
    replace: `match /ledgerBatches/{ledgerBatchId} {
      allow read: if isSuperAdmin();
      allow create: if isSuperAdmin();
      allow update: if false;
      allow delete: if isSuperAdmin();
    }`
  }
];

async function run() {
  console.log("=========================================");
  console.log("ABUFAUZAN TECH CMP");
  console.log("D121 - FINANCIAL UPDATE LOCK");
  console.log("=========================================");

  const result = await transaction(patches);

  console.log("D121 TRANSACTION RESULT:");
  console.log(JSON.stringify(result, null, 2));

  if (!result.success) {
    process.exitCode = 1;
    console.log("=========================================");
    console.log("D121 PATCH FAIL");
    console.log("=========================================");
    return;
  }

  console.log("=========================================");
  console.log("D121 PATCH COMPLETE");
  console.log("=========================================");
}

run();
