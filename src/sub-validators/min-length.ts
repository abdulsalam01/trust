import { IsStringSubValidator } from "./is-string";

export class MinLengthSubValidator extends IsStringSubValidator {
  constructor(private length: number, errorMessage?: string) {
    super(errorMessage);
  }

  validate(obj: any) {
    const superValidation = super.validate(obj);
    if (!superValidation) return false;

    if (obj.length < this.length) {
      return false;
    }

    return true;
  }
}
