import express from "express";
import crypto from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import {
  getFirestore,
  FieldValue
} from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();
const app = express();

app.use(express.json({ limit: "32kb" }));

const REQUIRED_STRINGS = [
  "coopName",
  "registrationNumber",
  "coopType",
  "country",
  "state",
  "city",
  "officeAddress",
  "coopEmail",
  "coopPhone",
  "adminName",
  "adminEmail",
  "subscriptionPlan"
];

function validateApplication(data) {
  for (const field of REQUIRED_STRINGS) {
    if (
      typeof data?.[field] !== "string" ||
      data[field].trim() === ""
    ) {
      return `A valid ${field} is required.`;
    }
  }

  return null;
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "cooperative-application-server",
    status: "ok"
  });
});

app.post("/api/cooperatives/apply", async (req, res) => {
  try {
    const data = req.body || {};

    const validationError = validateApplication(data);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const cooperativeId =
      `CMP-${data.country.trim().toUpperCase()}-${crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 12)
        .toUpperCase()}`;

    const cooperativeRef = db
      .collection("cooperatives")
      .doc(cooperativeId);

    await cooperativeRef.create({
      cooperativeId,
      cooperativeName: data.coopName.trim(),
      registrationNumber: data.registrationNumber.trim(),
      cooperativeType: data.coopType.trim(),
      country: data.country.trim(),
      state: data.state.trim(),
      city: data.city.trim(),
      officeAddress: data.officeAddress.trim(),
      officialEmail: data.coopEmail.trim().toLowerCase(),
      officialPhone: data.coopPhone.trim(),
      administratorName: data.adminName.trim(),
      administratorEmail: data.adminEmail.trim().toLowerCase(),
      subscriptionPlan: data.subscriptionPlan.trim(),
      status: "pending",
      createdAt: FieldValue.serverTimestamp()
    });

    console.log(
      "Cooperative application submitted:",
      cooperativeId
    );

    return res.status(201).json({
      success: true,
      cooperativeId,
      message: "Cooperative application submitted successfully."
    });
  } catch (error) {
    console.error(
      "Cooperative application submission failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to submit cooperative application."
    });
  }
});

export default app;
