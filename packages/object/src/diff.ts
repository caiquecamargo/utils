import { ObjectLike, isArray } from "@caiquecamargo/helpers";
import { is } from "typia";

export interface DifferenceCreate {
  type: "CREATE";
  path: (string | number)[];
  value: any;
}

export interface DifferenceRemove {
  type: "REMOVE";
  path: (string | number)[];
  oldValue: any;
}

export interface DifferenceChange {
  type: "CHANGE";
  path: (string | number)[];
  value: any;
  oldValue: any;
}

export type Difference = DifferenceCreate | DifferenceRemove | DifferenceChange;

interface Options {
  cyclesFix: boolean;
}

const richTypes = { Date: true, RegExp: true, String: true, Number: true };

export const diff = (
  obj: ObjectLike | ArrayLike<unknown>,
  newObj: ObjectLike | ArrayLike<unknown>,
  options: Partial<Options> = { cyclesFix: true },
  _stack: ObjectLike[] = []
): Difference[] => {
  const diffs: Difference[] = [];
  const isObjArray = isArray(obj);

  for (const key in obj) {
    const objKey = obj[key];
    const path = isObjArray ? +key : key;

    if (!(key in newObj)) {
      diffs.push({
        type: "REMOVE",
        path: [path],
        oldValue: obj[key],
      });
      continue;
    }

    const newObjKey = newObj[key];
    const areObjects = is<ObjectLike>(objKey) && is<ObjectLike>(newObjKey);

    const objectName: keyof typeof richTypes =
      Object.getPrototypeOf(objKey).constructor.name;

    if (
      objKey &&
      newObjKey &&
      areObjects &&
      !richTypes[objectName] &&
      (!options.cyclesFix || !_stack.includes(objKey))
    ) {
      const nestedDiffs = diff(
        objKey,
        newObjKey,
        options,
        options.cyclesFix ? _stack.concat([objKey]) : []
      );
      diffs.push.apply(
        diffs,
        nestedDiffs.map((difference) => {
          difference.path.unshift(path);
          return difference;
        })
      );
    } else if (
      objKey !== newObjKey &&
      !(
        areObjects &&
        (is<number>(objKey)
          ? objKey + "" === newObjKey + ""
          : +objKey === +newObjKey)
      )
    ) {
      diffs.push({
        path: [path],
        type: "CHANGE",
        value: newObjKey,
        oldValue: objKey,
      });
    }
  }

  const isNewObjArray = Array.isArray(newObj);
  for (const key in newObj) {
    if (!(key in obj)) {
      diffs.push({
        type: "CREATE",
        path: [isNewObjArray ? +key : key],
        value: newObj[key],
      });
    }
  }
  return diffs;
};

export const removes = (
  obj: ObjectLike | ArrayLike<unknown>,
  newObj: ObjectLike | ArrayLike<unknown>,
  options: Partial<Options> = { cyclesFix: true }
) => {
  const diffs = diff(obj, newObj, options);

  return diffs.filter((diff) => diff.type === "REMOVE") as DifferenceRemove[];
};

export const changes = (
  obj: ObjectLike | ArrayLike<unknown>,
  newObj: ObjectLike | ArrayLike<unknown>,
  options: Partial<Options> = { cyclesFix: true }
) => {
  const diffs = diff(obj, newObj, options);

  return diffs.filter((diff) => diff.type === "CHANGE") as DifferenceChange[];
};

export const adds = (
  obj: ObjectLike | ArrayLike<unknown>,
  newObj: ObjectLike | ArrayLike<unknown>,
  options: Partial<Options> = { cyclesFix: true }
) => {
  const diffs = diff(obj, newObj, options);

  return diffs.filter((diff) => diff.type === "CREATE") as DifferenceCreate[];
};
