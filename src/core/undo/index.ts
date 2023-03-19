import { ChangeSet, doChange, doInvertedChange } from "../diff/objDiff";
import { Obj } from "../types";

const pathKey = Symbol("pathKey");

export type HistoryInfo = {
  history: { cs: ChangeSet }[];
  index: number;
};

export function initPath(obj: any) {
  initPathDfs(obj, []);
}

export function initPathDfs(obj: any, path: string[]) {
  if (typeof obj === "object" && obj !== null) {
    for (let attr in obj) {
      path.push(attr);
      initPathDfs(obj[attr], path);
      path.pop();
    }
    obj[pathKey] = path.join(".");
  }
}

function getPath(obj: any) {
  return obj[pathKey];
}

export function execDo(snapshot: Obj, historyInfo: HistoryInfo, cs: ChangeSet) {
  const historyInfoValue = historyInfo;
  doChange(snapshot, cs);
  historyInfoValue.history[historyInfoValue.index] = { cs };
  historyInfoValue.index++;
  historyInfoValue.history.length = historyInfoValue?.index;
}

export function execUndo(snapshot: Obj, historyInfo: HistoryInfo) {
  const historyInfoValue = historyInfo;
  if (historyInfoValue.index > 0) {
    historyInfoValue.index--;
    const { cs } = historyInfoValue.history[historyInfoValue.index];
    doInvertedChange(snapshot, cs);
    return true;
  } else {
    return false;
  }
}

export function execRedo(snapshot: Obj, historyInfo: HistoryInfo) {
  const historyInfoValue = historyInfo;
  if (historyInfoValue.history.length > historyInfoValue.index) {
    const { cs } = historyInfoValue.history[historyInfoValue.index];
    doChange(snapshot, cs);
    historyInfoValue.index++;
    return true;
  } else {
    return false;
  }
}
