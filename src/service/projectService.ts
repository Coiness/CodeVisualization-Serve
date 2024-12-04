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

/*
 *projectDao 数据访问模块，用于和数据库进行交互
 *userService 用户服务模块，用于获取用户数据
 *Project 项目实体类
 *Subject 用于实现发布-订阅机制
 *WebsocketHandler 定义了WebSocket处理函数的类型
 *从core中导入的，设计项目操作的执行和历史记录管理
 */

//创建项目
export async function createProject(
  account: string,
  name: string,
  snapshot: string,
  description: string
) {
  let time = Date.now();
  let p = new Project(0, name, account, snapshot, time, time, 0, description);
  let res = await projectDao.addProject(p);
  return res;
}

//删除项目
export async function removeProject(id: string) {
  return projectDao.deleteProject(id);
}

//搜索项目（用户账户和项目名称）
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

//获取项目的详细信息
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

//根据账号获得项目
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

//更新项目名称
export async function updateProjectName(id: string, name: string) {
  let r = await projectDao.updateProject(id, ["projectName"], [name]);
  return r;
}

//更新项目权限
export async function updateProjectPermission(id: string, permission: number) {
  let r = await projectDao.updateProject(id, ["permission"], [permission]);
  return r;
}

//更新项目描述
export async function updateProjectDescription(
  id: string,
  description: string
) {
  let r = await projectDao.updateProject(id, ["description"], [description]);
  return r;
}

//更新项目快照
export async function updateProjectSnapshot(id: string, snapshot: string) {
  let r = await projectDao.updateProject(
    id,
    ["content", "modifyTime"],
    [snapshot, Date.now()]
  );
  return r;
}

//信息类型定义
type Info = {
  key: string;
  data: string;
};

//Subject订阅者名单，存储每个项目ID对应的订阅信息
const subjectMap: { [key: string]: { n: number; s: Subject<Info> } } = {};

//新增订阅
function getSubject(id: string) {
  if (!subjectMap[id]) {
    subjectMap[id] = { n: 1, s: new Subject<Info>() };
  } else {
    subjectMap[id].n++;
  }
  return subjectMap[id].s;
}

//取消订阅
function closeSubject(id) {
  if (subjectMap[id]) {
    subjectMap[id].n--;
    if (subjectMap[id].n === 0) {
      delete subjectMap[id];
    }
  }
}

//处理与项目相关的WebSocket连接，实现实时协作功能，如新动作、撤销、重做等
export const handleProjectWS: WebsocketHandler = async (ws, data, ready) => {
  let key: string;
  let id = data.id;
  let sub = getSubject(id);
  //订阅Subject
  let s = sub.subscribe((info: Info) => {
    if (key !== info.key) {
      ws.send(info.data);
    }
  });

  //添加协调
  await PC.addCorrdination(id);

  //定义WebSocket消息处理器
  ws.handler = async function (str: string) {
    let data = JSON.parse(str);
    key = `${Date.now()}`;
    if (["newAction", "undo", "redo"].includes(data.type)) {
      await PC.newMessage(id, data);
      sub.next({ key: key, data: str });
    }
  };

  //定义WebSocket关闭处理器
  ws.onClose = async function () {
    await PC.closeCorrdination(id);
    closeSubject(data.id);
    s.unsubscribe();
  };
  ready();
};

//项目协调管理（负责管理项目的快照、历史操作以及协调机制的启动和关闭，确保多个Websocket连接对同一项目的操作同步一致）

//定义了协调消息的类型：新动作、撤销和重做
export type ProjectCoordinationMessage =
  | {
      type: "newAction";
      action: Action;
    }
  | { type: "undo" }
  | { type: "redo" };

//类定义
class ProjectCoordination {
  //projectMap的属性
  private projectMap: {
    [id: string]: {
      snapshot: Obj;
      historyInfo: HistoryInfo;
      count: number;
    };
  } = {};

  //启动项目的协调机制
  async addCorrdination(projectId: string) {
    //检查projectMap是否已经存在ID
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

  //处理来自WebSocket的新消息
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

  //关掉协同作业
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

  //根据名字获得项目的数据
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

//创建实例
const PC = new ProjectCoordination();
