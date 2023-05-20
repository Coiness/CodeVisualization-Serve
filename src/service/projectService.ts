import * as projectDao from "../dao/projectDao";
import * as userService from "./userService";
import { Project } from "../pojo";
import { Subject, WebsocketHandler } from "../common";
import {
  Action,
  execDo,
  execRedo,
  execUndo,
  HistoryInfo,
  initPath,
  Obj,
} from "../core";

export async function createProject(
  account: string,
  name: string,
  snapshot: string,
  descrition: string
) {
  let time = Date.now();
  let p = new Project(0, name, account, snapshot, time, time, 0, descrition);
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
    o.user = await userService.getUserInfo(item.account);
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

  const d = await PC.getProjectData(id);
  if (d !== null) {
    r.snapshot = JSON.stringify(d.snapshot);
    r.historyInfo = JSON.stringify(d.historyInfo);
  }
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

export async function updateProjectDescrition(id: string, descrition: string) {
  let r = await projectDao.updateProject(id, ["descrition"], [descrition]);
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

export const handleProjectWS: WebsocketHandler = async (ws, data, ready) => {
  let key: string;
  let id = data.id;
  let sub = getSubject(id);
  let s = sub.subscribe((info: Info) => {
    if (key !== info.key) {
      ws.send(info.data);
    }
  });

  await PC.addCorrdination(id);

  ws.handler = async function (str: string) {
    let data = JSON.parse(str);
    key = `${Date.now()}`;
    if (["newAction", "undo", "redo"].includes(data.type)) {
      await PC.newMessage(id, data);
      sub.next({ key: key, data: str });
    }
  };
  ws.onClose = async function () {
    await PC.closeCorrdination(id);
    closeSubject(data.id);
    s.unsubscribe();
  };
  ready();
};

export type ProjectCoordinationMessage =
  | {
      type: "newAction";
      action: Action;
    }
  | { type: "undo" }
  | { type: "redo" };

class ProjectCoordination {
  private projectMap: {
    [id: string]: {
      snapshot: Obj;
      historyInfo: HistoryInfo;
      count: number;
    };
  } = {};

  async addCorrdination(projectId: string) {
    if (this.projectMap.hasOwnProperty(projectId)) {
      this.projectMap[projectId].count++;
    } else {
      let info = (await getProjectInfo(projectId)) as Project;
      let snapshot = JSON.parse(info.snapshot) as Obj;
      initPath(snapshot);
      this.projectMap[projectId] = {
        snapshot: snapshot,
        historyInfo: {
          history: [],
          index: 0,
        },
        count: 1,
      };
    }
  }

  async newMessage(
    projectId: string,
    data: ProjectCoordinationMessage
  ): Promise<void> {
    if (!this.projectMap.hasOwnProperty(projectId)) {
      throw new Error("ProjectCorrdination: not find connect");
    }

    let { snapshot, historyInfo } = this.projectMap[projectId];
    if (data.type === "newAction") {
      execDo(snapshot, historyInfo, data.action.cs);
    } else if (data.type === "undo") {
      execUndo(snapshot, historyInfo);
    } else if (data.type === "redo") {
      execRedo(snapshot, historyInfo);
    } else {
      throw new Error("ProjectCorrdination: newMessage data.type error");
    }
  }

  async closeCorrdination(projectId: string) {
    if (this.projectMap.hasOwnProperty(projectId)) {
      this.projectMap[projectId].count--;
      if (this.projectMap[projectId].count === 0) {
        let flag = await updateProjectSnapshot(
          projectId,
          JSON.stringify(this.projectMap[projectId].snapshot)
        );
        if (!flag) {
          throw new Error("ProjectCorrdination: updateProjectSnapshot error");
        }
        delete this.projectMap[projectId];
      }
    } else {
      throw new Error("ProjectCorrdination: not find connect");
    }
  }

  async getProjectData(projectId: string) {
    if (this.projectMap.hasOwnProperty(projectId)) {
      return {
        snapshot: this.projectMap[projectId].snapshot,
        historyInfo: this.projectMap[projectId].historyInfo,
      };
    } else {
      return null;
    }
  }
}

const PC = new ProjectCoordination();
