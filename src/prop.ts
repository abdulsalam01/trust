import { Schema } from "./schema";
import { SubValidator, ValidationResult } from "./sub-validators/base";
import { IsStringSubValidator } from "./sub-validators/is-string";
import { MinLengthSubValidator } from "./sub-validators/min-length";

export class Prop {
  isValidateEach: boolean;
  validationType: undefined | "schema" | "primitive";
  schema?: Schema;

  private validationPipe: SubValidator[];

  constructor() {
    this.validationPipe = [];
  }

  validateEach() {
    this.isValidateEach = true;
    return this;
  }

  useSchema(schema: Schema) {
    if (this.validationType === "primitive")
      throw new Error("Cannot mix Primitive validation with Schema validation");
    this.validationType = "schema";
    this.schema = schema;
    return this;
  }

  isString(errorMessage: string = "Invalid string.") {
    if (this.validationType === "schema")
      throw new Error("Cannot mix Primitive validation with Schema validation");
    this.validationType = "primitive";
    const validator = new IsStringSubValidator(errorMessage);
    this.validationPipe.push(validator);
    return this;
  }

  minLength(length: number, errorMessage?: string) {
    if (this.validationType === "schema")
      throw new Error("Cannot mix Primitive validation with Schema validation");
    this.validationType = "primitive";
    const validator = new MinLengthSubValidator(
      length,
      errorMessage || "Minimum length is " + length + " chars."
    );
    this.validationPipe.push(validator);
    return this;
  }

  validate(obj: any): ValidationResult[] {
    if (this.validationType === "primitive") {
      const results: ValidationResult[] = [];
      for (const validator of this.validationPipe) {
        const isValid = validator.validate(obj);
        const isError = !isValid;
        const errorMessage = validator.errorMessage;
        results.push({
          isError,
          path: "",
          errorMessage,
        });
      }
      return results;
    } else if (this.validationType === "schema") {
      const results = this.schema.validate(obj);
      return results;
    } else {
      return [];
    }
  }
}
