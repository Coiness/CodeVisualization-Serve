import * as projectDao from "../dao/projectDao";
import * as userService from "./userService";
import { Project } from "../pojo";

export async function createProject(
  account: string,
  name: string,
  snapshot: string
) {
  let time = Date.now();
  let p = new Project(0, name, account, snapshot, time, time, 0);
  let res = await projectDao.addProject(p);
  return res;
}

export async function removeProject(id: string) {
  return projectDao.deleteProject(id);
}

export async function searchProject(account: string, name: string) {
  let ps = await projectDao.getProjectsByName(name, account);
  if (ps === null) {
    return null;
  }
  let res: any[] = [];
  for (let item of ps) {
    let o: { [key: string]: any } = { ...item };
    o.user = await userService.getUserInfo(account);
    res.push(o);
  }
  return res;
}

export async function getProjectInfo(id: string) {
  let p = await projectDao.getProjectById(id);
  if (p === null) {
    return null;
  }
  let r: { [key: string]: any } = { ...p };
  r.user = await userService.getUserInfo(r.account);
  return r;
}

export async function getProjctByAccount(account: string, isSelf: boolean) {
  let ps = await projectDao.getProjectsByAccount(account, !isSelf);
  if (ps === null) {
    return null;
  }
  let res: any[] = [];
  for (let item of ps) {
    let o: { [key: string]: any } = { ...item };
    o.user = await userService.getUserInfo(account);
    res.push(o);
  }
  return res;
}

export async function updateProjectName(id: string, name: string) {
  let r = await projectDao.updateProject(id, ["projectName"], [name]);
  return r;
}

export async function updateProjectPermission(id: string, permission: number) {
  let r = await projectDao.updateProject(id, ["permission"], [permission]);
  return r;
}

export async function updateProjectSnapshot(id: string, snapshot: string) {
  let r = await projectDao.updateProject(
    id,
    ["content", "modifyTime"],
    [snapshot, Date.now()]
  );
  return r;
}
