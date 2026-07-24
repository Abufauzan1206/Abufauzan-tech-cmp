export class CMPValidator {

  static required(value) {

    return value.trim() !== "";

  }

  static email(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  }

  static password(value) {

    return value.length >= 8;

  }

  static phone(value) {

    return value.trim().length >= 10;

  }

}