import * as algorithmDao from "../dao/algorithmDao";
import * as userService from "./userService";
import { Algorithm } from "../pojo";

export async function createAlgorithm(
  account: string,
  name: string,
  snapshot: string
) {
  let time = Date.now();
  let p = new Algorithm(0, name, account, snapshot, time, time, 0);
  let res = await algorithmDao.addAlgorithm(p);
  return res;
}

export async function removeAlgorithm(id: string) {
  return algorithmDao.deleteAlgorithm(id);
}

export async function getAlgorithmInfo(id: string) {
  let p = await algorithmDao.getAlgorithmById(id);
  if (p === null) {
    return null;
  }
  let r: { [key: string]: any } = { ...p };
  r.user = await userService.getUserInfo(r.account);
  return r;
}

export async function searchAlgorithm(account: string, name: string) {
  let ps = await algorithmDao.getAlgorithmsByName(name, account);
  if (ps === null) {
    return null;
  }
  let res: any = [];
  for (let item of ps) {
    let o: { [key: string]: any } = { ...item };
    o.user = await userService.getUserInfo(account);
    res.push(o);
  }
  return res;
}

export async function getProjctByAccount(account: string, isSelf: boolean) {
  let ps = await algorithmDao.getAlgorithmsByAccount(account, !isSelf);
  if (ps === null) {
    return null;
  }
  let res: any = [];
  for (let item of ps) {
    let o: { [key: string]: any } = { ...item };
    o.user = await userService.getUserInfo(account);
    res.push(o);
  }
  return res;
}

export async function updateAlgorithmName(id: string, name: string) {
  let r = await algorithmDao.updateAlgorithm(id, ["algorithmName"], [name]);
  return r;
}

export async function updateAlgorithmPermission(
  id: string,
  permission: number
) {
  let r = await algorithmDao.updateAlgorithm(id, ["permission"], [permission]);
  return r;
}

export async function updateAlgorithmContent(id: string, snapshot: string) {
  let r = await algorithmDao.updateAlgorithm(
    id,
    ["content", "modifyTime"],
    [snapshot, Date.now()]
  );
  return r;
}
