import * as projectDao from "../dao/projectDao";
import * as userService from "./userService";
import { Project } from "../pojo";
import { Subject, WebsocketHandler } from "../common";

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

type Info = {
  key: string;
  data: string;
};

const subjectMap: { [key: string]: { n: number; s: Subject<Info> } } = {};

function getSubject(id: string) {
  if (!subjectMap[id]) {
    subjectMap[id] = { n: 1, s: new Subject<Info>() };
  } else {
    subjectMap[id].n++;
  }
  return subjectMap[id].s;
}

function closeSubject(id) {
  if (subjectMap[id]) {
    subjectMap[id].n--;
    if (subjectMap[id].n === 0) {
      delete subjectMap[id];
    }
  }
}

export const handleProjectWS: WebsocketHandler = (ws, data, ready) => {
  let key: string;
  let sub = getSubject(data.id);
  let s = sub.subscribe((info: Info) => {
    if (key !== info.key) {
      ws.send(info.data);
    }
  });

  ws.handler = function (str: string) {
    let data = JSON.parse(str);
    key = `${Date.now()}`;
    if (["newAction", "undo", "redo"].includes(data.type)) {
      sub.next({ key: key, data: str });
    }
  };
  ws.onClose = function () {
    closeSubject(data.id);
    s.unsubscribe();
  };
  ready();
};
