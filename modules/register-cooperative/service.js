import { db } from "../../js/firebase-config.js";

import { generateCMPId } from "../../js/utils/generator.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import { getFunctions, httpsCallable } from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const functions = getFunctions();

const submitCooperativeApplication = httpsCallable(
  functions,
  "submitCooperativeApplication"
);

export async function createCooperative(data) {
  const result =
    await submitCooperativeApplication(data);

  if (
    !result?.data?.success ||
    !result?.data?.cooperativeId
  ) {
    throw new Error(
      result?.data?.message ||
      "Unable to submit cooperative application."
    );
  }

  return result.data.cooperativeId;
}