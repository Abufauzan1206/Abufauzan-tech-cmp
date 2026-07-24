export class CMPForm {

  static getData(form) {

    const formData = new FormData(form);

    return Object.fromEntries(formData.entries());

  }

  static reset(form) {

    form.reset();

  }

}