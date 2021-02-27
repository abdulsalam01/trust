import { ValidationResult } from "./sub-validators/base";

export const groupByName = (vrs: ValidationResult[]) => {
  const ret: { [key: string]: string[] } = {};
  for (const vr of vrs) {
    const { path, isError, errorMessage } = vr;
    if (ret[path] instanceof Array) {
      ret[path].push(errorMessage);
    } else {
      ret[path] = [errorMessage];
    }
  }

  return ret;
};

export const generateTree = (vrs: ValidationResult[]) => {
  const obj: any = {};
  const grouped = groupByName(vrs);
  for (const groupKey of Object.keys(grouped)) {
    const paths = groupKey.split(".");
    let currObj = obj;
    for (let i = 0; i < paths.length; i++) {
      const isLast = i === paths.length - 1;
      const nextIsArray = paths[i + 1] && !isNaN(Number(paths[i + 1]));
      const p = paths[i];
      if (!currObj[p]) {
        if (nextIsArray) {
          currObj[p] = [];
        } else {
          currObj[p] = {};
        }
      }
      if (isLast) {
        currObj[p] = grouped[groupKey];
      } else {
        currObj = currObj[p];
      }
    }
  }
  return obj;
};

export * from "./schema";
export * from "./prop";
