import { db } from "../firebase-config.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function seedCountry(country) {

  await setDoc(

    doc(db, "countries", country.code),

    country

  );

}