import { validateForm } from "./validator.js";

import { createCooperative } from "./service.js";

import { CMPWizard } from "../../js/components/wizard.js";

import { CMPForm } from "../../js/components/form.js";

import { CMPToast } from "../../js/components/toast.js";

import { CMPStorage } from "../../js/components/storage.js";

const form = document.getElementById("registerCooperativeForm");

form?.addEventListener("input", () => {

  const data = CMPForm.getData(form);

  CMPStorage.save(
    "registerCooperativeDraft",
    data
  );

});

const draft = CMPStorage.load("registerCooperativeDraft");

if (draft && form) {

  Object.keys(draft).forEach(key => {

    const field = form.elements[key];

    if (field) {

      field.value = draft[key];

    }

  });

}

const wizard = new CMPWizard();

if (form) {

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const data = CMPForm.getData(form);

    if (!validateForm(data)) {
      return;
    }
    
    CMPToast.info("Validation completed.");
    
    try {

  const cooperativeId =
    await createCooperative(data);

  CMPToast.success(
  "Cooperative created successfully!\n\nID: "
  + cooperativeId
);

CMPStorage.remove("registerCooperativeDraft");

} catch (error) {

  CMPToast.error(error.message);

}

  });

}