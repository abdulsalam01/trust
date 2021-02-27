import { SubValidator } from "./base";

export class IsStringSubValidator implements SubValidator {
  constructor(public errorMessage?: string) {}

  validate(obj: any) {
    if (typeof obj !== "string") {
      return false;
    }
    return true;
  }
}
