import { get, cloneDeep } from "lodash";
import { Obj } from "../types";
import { initPathDfs } from "../undo";

export type ChangeSet = {
  modelPath: string; // 对应逻辑层 model path
  t: "u" | "d" | "c"; // 操作类型
  p: string; // 操作路径 path
  c: any[]; // 具体操作
}[];

export function doChange(obj: Obj, cs: ChangeSet) {
  // 防止 cs 中 create 的对象被修改，导致影响 cs
  cs = cloneDeep(cs);
  cs.forEach((change) => {
    const path = change.p.split(".");
    let attr = path.pop();
    let p = path.join(".");
    let o = obj;
    if (p !== "") {
      o = get(obj, p);
    }
    if (!o || !attr) {
      throw new Error("doChange error, o or attr is undefined");
    }
    if (change.t === "u") {
      o[attr] = change.c[1];
      initPathDfs(o[attr], [...path, attr]);
    } else if (change.t === "d") {
      delete o[attr];
    } else if (change.t === "c") {
      o[attr] = change.c[0];
      initPathDfs(o[attr], [...path, attr]);
    }
  });
}

export function doInvertedChange(obj: Obj, cs: ChangeSet) {
  doChange(obj, getInvertedChangeSet(cs));
}

function getInvertedChangeSet(cs: ChangeSet) {
  cs = cloneDeep(cs);
  cs.forEach((change) => {
    if (change.t === "c") {
      change.t = "d";
    } else if (change.t === "d") {
      change.t = "c";
    } else if (change.t === "u") {
      let temp = change.c[0];
      change.c[0] = change.c[1];
      change.c[1] = temp;
    }
  });
  cs.reverse(); // CS 中可能会有先后依赖关系，所以获取反向 CS 后需要将其反转
  return cs;
}
