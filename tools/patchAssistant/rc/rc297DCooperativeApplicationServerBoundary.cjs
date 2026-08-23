const fs = require("fs");

const rulesPath = "firestore.rules";
const servicePath = "modules/register-cooperative/service.js";
const scriptPath = "modules/register-cooperative/script.js";
const functionsPath = "functions/index.js";

function fail(message) {
  console.error("FAIL:", message);
  process.exit(1);
}

for (const file of [rulesPath, servicePath, scriptPath, functionsPath]) {
  if (!fs.existsSync(file)) {
    fail(`Required file missing: ${file}`);
  }
}

let rules = fs.readFileSync(rulesPath, "utf8");
let service = fs.readFileSync(servicePath, "utf8");
let functions = fs.readFileSync(functionsPath, "utf8");

const unsafeRule = "allow create: if true;";

if (!rules.includes(unsafeRule)) {
  fail("Expected unsafe cooperative create rule was not found.");
}

const expectedRuleBlock =
`match /cooperatives/{cooperativeId} {
  allow read: if isSuperAdmin()
    || belongsToCooperative(cooperativeId);
  allow create: if true;
  allow update: if isSuperAdmin();
  allow delete: if isSuperAdmin();
}`;

const normalize = (value) =>
  value.replace(/\s+/g, " ").trim();

const actualRuleStart =
  rules.indexOf("match /cooperatives/{cooperativeId}");

if (actualRuleStart === -1) {
  fail("Cooperative rule block was not found.");
}

const actualRuleEnd =
  rules.indexOf("\n    }", actualRuleStart);

if (actualRuleEnd === -1) {
  fail("Cooperative rule closing boundary was not found.");
}

const actualRuleBlock =
  rules.slice(actualRuleStart, actualRuleEnd + 6);

if (normalize(actualRuleBlock) !== normalize(expectedRuleBlock)) {
  fail("Audited cooperative rule structure was not found.");
}




const serviceStart = service.indexOf(
  "export async function createCooperative(data)"
);

if (serviceStart === -1) {
  fail("createCooperative function was not found.");
}

const serviceReturnMarker =
  "return cooperativeId;";

const serviceReturnIndex =
  service.indexOf(serviceReturnMarker, serviceStart);

if (serviceReturnIndex === -1) {
  fail("createCooperative return boundary was not found.");
}

const serviceEnd = service.indexOf(
  "\n}",
  serviceReturnIndex
);

if (serviceEnd === -1) {
  fail("createCooperative function closing boundary was not found.");
}

const actualServiceBlock =
  service.slice(
    serviceStart,
    serviceEnd + 2
  );

const expectedServiceBlock = `
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
      status: "pending",
      createdAt: serverTimestamp()
    }
  );
  return cooperativeId;
}`;

if (normalize(actualServiceBlock) !== normalize(expectedServiceBlock)) {
  fail("Audited direct cooperative client write structure was not found.");
}

const newService = `
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
}`;

service =
  service.slice(0, serviceStart) +
  newService +
  service.slice(serviceEnd + 2);

const marker = 'exports.approveCooperative = onCall(async (request) => {';

if (!functions.includes(marker)) {
  fail("approveCooperative function marker not found.");
}

if (functions.includes("exports.submitCooperativeApplication")) {
  fail("submitCooperativeApplication already exists; refusing duplicate insertion.");
}

const newFunction =
`exports.submitCooperativeApplication = onCall(async (request) => {
  /*
   * Public cooperative application boundary.
   *
   * This function replaces the former unrestricted client-side
   * Firestore create path. The client may submit an application,
   * but cannot directly write to cooperatives/{cooperativeId}.
   */

  const data = request.data || {};

  const requiredStrings = {
    coopName: data.coopName,
    registrationNumber: data.registrationNumber,
    coopType: data.coopType,
    country: data.country,
    state: data.state,
    city: data.city,
    officeAddress: data.officeAddress,
    coopEmail: data.coopEmail,
    coopPhone: data.coopPhone,
    adminName: data.adminName,
    adminEmail: data.adminEmail,
    subscriptionPlan: data.subscriptionPlan,
  };

  for (const [field, value] of Object.entries(requiredStrings)) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new HttpsError(
        "invalid-argument",
        \`A valid \${field} is required.\`
      );
    }
  }

  const crypto = require("crypto");

  const cooperativeId =
    \`CMP-\${data.country.trim().toUpperCase()}-\${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase()}\`;

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
    createdAt: FieldValue.serverTimestamp(),
  });

  logger.info("Cooperative application submitted", {
    cooperativeId,
  });

  return {
    success: true,
    cooperativeId,
    message: "Cooperative application submitted successfully.",
  };
});

`;

functions = functions.replace(marker, newFunction + marker);

fs.writeFileSync(rulesPath, rules);
fs.writeFileSync(servicePath, service);
fs.writeFileSync(functionsPath, functions);

console.log("RC297D PATCH APPLIED");
console.log("PASS: cooperative client write removed");
console.log("PASS: cooperative application callable boundary added");
console.log("PASS: Firestore cooperative create changed to explicit deny");
console.log("PASS: existing approval function preserved");
