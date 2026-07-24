import { db } from "../../js/firebase-config.js";

import { generateCMPId } from "../../js/utils/generator.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function createCooperative(data) {

  const cooperativeId = generateCMPId(data.country);

  await setDoc(
    doc(db, "cooperatives", cooperativeId),
{
  cooperativeId: cooperativeId,

  cooperativeName: data.coopName,

  registrationNumber: data.registrationNumber,

  cooperativeType: data.coopType,

  country: data.country,

  state: data.state,

  city: data.city,

  officeAddress: data.officeAddress,

  officialEmail: data.coopEmail,

  officialPhone: data.coopPhone,

  administratorName: data.adminName,

  administratorEmail: data.adminEmail,

  subscriptionPlan: data.subscriptionPlan,

  status: "Active",

  createdAt: serverTimestamp()
}
  );

  return cooperativeId;

}