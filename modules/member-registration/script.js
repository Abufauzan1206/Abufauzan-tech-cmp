alert("Registration script loaded");

import { registerMember } from "../../js/services/memberService.js";

const personalInfoStep =
document.getElementById("personalInfoStep");

const contactInfoStep =
document.getElementById("contactInfoStep");

const nextStep1 =
document.getElementById("nextStep1");

const previousStep2 =
document.getElementById("previousStep2");

const nextStep2 =
document.getElementById("nextStep2");

const nextOfKinStep =
document.getElementById("nextOfKinStep");

const previousStep3 =
document.getElementById("previousStep3");

const nextStep3 =
document.getElementById("nextStep3");

const cooperativeStep =
document.getElementById("cooperativeStep");

const previousStep4 =
document.getElementById("previousStep4");

const submitMember =
document.getElementById("submitMember");

const progressText =
document.getElementById("progressText");

const firstName =
document.getElementById("firstName");

const lastName =
document.getElementById("lastName");

const gender =
document.getElementById("gender");

if (nextStep1) {

  nextStep1.addEventListener("click", () => {

  if (firstName.value.trim() === "") {

    alert("Please enter First Name.");

    firstName.focus();

    return;

  }

  if (lastName.value.trim() === "") {

    alert("Please enter Last Name.");

    lastName.focus();

    return;

  }

  if (gender.value === "") {

    alert("Please select Gender.");

    gender.focus();

    return;

  }

    personalInfoStep.style.display = "none";

    contactInfoStep.style.display = "block";

    progressText.textContent =
      "Step 2 of 4 • 50% Complete";

  });

}

if (previousStep2) {

  previousStep2.addEventListener("click", () => {

    contactInfoStep.style.display = "none";

    personalInfoStep.style.display = "block";

    progressText.textContent =
      "Step 1 of 4 • 25% Complete";

  });

}

if (nextStep2) {

  nextStep2.addEventListener("click", () => {

    contactInfoStep.style.display = "none";

    nextOfKinStep.style.display = "block";

    progressText.textContent =
      "Step 3 of 4 • 75% Complete";

  });

}

if (previousStep3) {

  previousStep3.addEventListener("click", () => {

    nextOfKinStep.style.display = "none";

    contactInfoStep.style.display = "block";

    progressText.textContent =
      "Step 2 of 4 • 50% Complete";

  });

}

if (nextStep3) {

  nextStep3.addEventListener("click", () => {

    nextOfKinStep.style.display = "none";

    cooperativeStep.style.display = "block";

    progressText.textContent =
      "Step 4 of 4 • 100% Complete";

  });

}

if (previousStep4) {

  previousStep4.addEventListener("click", () => {

    cooperativeStep.style.display = "none";

    nextOfKinStep.style.display = "block";

    progressText.textContent =
      "Step 3 of 4 • 75% Complete";

  });

}

if (submitMember) {

  submitMember.addEventListener("click", async (e) => {

    e.preventDefault();

    try {

      const memberData = {

        firstName: firstName.value.trim(),

        middleName: document.getElementById("middleName").value.trim(),

        lastName: lastName.value.trim(),

        gender: gender.value,

        phone: document.getElementById("phone").value.trim(),

        email: document.getElementById("email").value.trim(),

        nokName: document.getElementById("nokName").value.trim(),

        nokRelationship: document.getElementById("nokRelationship").value.trim(),

        nokPhone: document.getElementById("nokPhone").value.trim(),

        nokAddress: document.getElementById("nokAddress").value.trim(),

        cooperative: document.getElementById("cooperative").value,

        membershipNumber: document.getElementById("membershipNumber").value.trim()

      };

      const result = await registerMember(memberData);

      alert(
  "✅ Member Registered Successfully!\n\n" +
  "Membership Number: " + result.memberNumber
);

      document.getElementById("memberRegistrationForm").reset();

      personalInfoStep.style.display = "block";
      contactInfoStep.style.display = "none";
      nextOfKinStep.style.display = "none";
      cooperativeStep.style.display = "none";

      progressText.textContent = "Step 1 of 4 • 25% Complete";

    } catch (error) {

      alert("Registration failed: " + error.message);

      console.error(error);

    }

  });

}