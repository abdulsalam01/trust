import { Prop } from "./prop";
import resolver from "./resolver";
import { ValidationResult } from "./sub-validators/base";

export function filterJoinPath(paths: (string | number)[]) {
  return paths.filter((str) => str !== "").join(".");
}

type propFunc = (selector: string) => Prop;

export class SchemaProp {
  constructor(public readonly selector: string, public readonly prop: Prop) {}
}

export class Schema {
  private constructor(private readonly props: SchemaProp[]) {}
  static Factory(constructor: (prop: propFunc) => void) {
    const props: SchemaProp[] = [];
    constructor((selector: string) => {
      const p = new Prop();
      const schemaProp = new SchemaProp(selector, p);
      props.push(schemaProp);
      return p;
    });
    return new Schema(props);
  }

  validate(obj: any): ValidationResult[] {
    const results: ValidationResult[] = [];

    // iterate all props
    for (const p of this.props) {
      const { selector, prop } = p;

      // select current path
      const toBeValidated = resolver(obj, selector);

      if (prop.isValidateEach) {
        // process array
        if (toBeValidated instanceof Array) {
          // subResults
          const _results: ValidationResult[] = [];

          for (let i = 0; i < toBeValidated.length; i++) {
            if (prop.validationType) {
              // subSubResults
              const __results = prop.validate(toBeValidated[i]);

              // append selector
              _results.push(
                ...__results.map((vr) => {
                  vr.path = filterJoinPath([selector, i, vr.path]);
                  return vr;
                })
              );
            }
          }

          // push to results
          results.push(..._results);
        } else {
          // throw error if array validation validates non array
          results.push(
            new ValidationResult(selector, true, selector + " is not an Array.")
          );
        }
      } else {
        // process non array
        if (prop.validationType) {
          const _results = prop.validate(toBeValidated);
          // append selector
          results.push(
            ..._results.map((vr) => {
              vr.path = filterJoinPath([selector, vr.path]);
              return vr;
            })
          );
        }
      }
    }

    return results;
  }
}
