import * as algorithmDao from "../dao/algorithmDao";
import * as userService from "./userService";
import { Algorithm } from "../pojo";

/*
 *algorithmDao 与数据库进行交互
 *userService 获取用户信息
 *Algorithm 引入实体类
 */

//创建算法
export async function createAlgorithm(
  account: string,
  name: string,
  snapshot: string,
  descrition: string
) {
  let time = Date.now();
  let p = new Algorithm(0, name, account, snapshot, time, time, 0, descrition);
  let res = await algorithmDao.addAlgorithm(p);
  return res;
}

//移除算法
export async function removeAlgorithm(id: string) {
  return algorithmDao.deleteAlgorithm(id);
}

//获取算法
export async function getAlgorithmInfo(id: string) {
  let p = await algorithmDao.getAlgorithmById(id);
  if (p === null) {
    return null;
  }
  let r: { [key: string]: any } = { ...p };
  r.user = await userService.getUserInfo(r.account);
  return r;
}

//搜索算法
export async function searchAlgorithm(account: string, name: string) {
  let ps = await algorithmDao.getAlgorithmsByName(name, account);
  if (ps === null) {
    return null;
  }
  let res: any = [];
  for (let item of ps) {
    let o: { [key: string]: any } = { ...item };
    o.user = await userService.getUserInfo(item.account);
    res.push(o);
  }
  return res;
}

//根据账号获取项目
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

//更新算法名称
export async function updateAlgorithmName(id: string, name: string) {
  let r = await algorithmDao.updateAlgorithm(id, ["algorithmName"], [name]);
  return r;
}

//更新算法描述
export async function updateAlgorithmDescrition(
  id: string,
  descrition: number
) {
  let r = await algorithmDao.updateAlgorithm(id, ["descrition"], [descrition]);
  return r;
}

//更新算法权限
export async function updateAlgorithmPermission(
  id: string,
  permission: number
) {
  let r = await algorithmDao.updateAlgorithm(id, ["permission"], [permission]);
  return r;
}

//更新算法内容
export async function updateAlgorithmContent(id: string, snapshot: string) {
  let r = await algorithmDao.updateAlgorithm(
    id,
    ["content", "modifyTime"],
    [snapshot, Date.now()]
  );
  return r;
}
