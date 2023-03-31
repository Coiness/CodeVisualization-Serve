import * as projectService from "../service/projectService";
import { nil } from "../common";
import resultUtil from "./resultUtil";
import { checkUser } from "./checkUser";

export function projectController(app) {
  app.post("/project/create", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let name = req.body.name;
    let snapshot = req.body.snapshot;
    let descrition = req.body.descrition;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ name, snapshot, descrition })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let id = await projectService.createProject(
      account,
      name,
      snapshot,
      descrition
    );

    // 返回结果
    if (id) {
      res.send(resultUtil.success("创建成功", { id }));
    } else {
      res.send(resultUtil.reject("创建失败"));
    }
  });

  app.post("/project/remove", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.body.id;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ id })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let project = await projectService.getProjectInfo(id);
    if (project === null) {
      res.send(resultUtil.reject("要删除的东西不存在"));
      return;
    }
    if (project.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await projectService.removeProject(id);

    if (flag) {
      res.send(resultUtil.success("删除成功"));
    } else {
      res.send(resultUtil.reject("删除失败"));
    }
  });

  app.post("/project/rename", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.body.id;
    let name = req.body.name;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ id })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let project = await projectService.getProjectInfo(id);
    if (project === null) {
      res.send(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (project.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await projectService.updateProjectName(id, name);

    if (flag) {
      res.send(resultUtil.success("修改成功"));
    } else {
      res.send(resultUtil.reject("修改失败"));
    }
  });

  app.post("/project/save", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.body.id;
    let snapshot = req.body.snapshot;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ id, snapshot })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let project = await projectService.getProjectInfo(id);
    if (project === null) {
      res.send(resultUtil.reject("要保存的东西不存在"));
      return;
    }
    if (project.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await projectService.updateProjectSnapshot(id, snapshot);

    if (flag) {
      res.send(resultUtil.success("保存成功"));
    } else {
      res.send(resultUtil.reject("保存失败"));
    }
  });

  app.post("/project/updateDescrition", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.body.id;
    let descrition = req.body.descrition;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ id, descrition })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let project = await projectService.getProjectInfo(id);
    if (project === null) {
      res.send(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (project.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await projectService.updateProjectDescrition(id, descrition);

    if (flag) {
      res.send(resultUtil.success("修改成功"));
    } else {
      res.send(resultUtil.reject("修改失败"));
    }
  });

  app.post("/project/updatePermission", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.body.id;
    let permission = req.body.permission;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ id })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let project = await projectService.getProjectInfo(id);
    if (project === null) {
      res.send(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (project.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await projectService.updateProjectPermission(id, permission);

    if (flag) {
      res.send(resultUtil.success("修改成功"));
    } else {
      res.send(resultUtil.reject("修改失败"));
    }
  });

  app.get("/project/loadInfo", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.query.id;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ id })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let project = await projectService.getProjectInfo(id);
    if (project === null) {
      res.send(resultUtil.reject("不存在"));
      return;
    }
    if (project.account !== account && project.permission === 0) {
      res.send(resultUtil.identityError());
      return;
    }

    res.send(resultUtil.success("获取成功", project));
  });

  app.get("/project/search", async function (req, res) {
    // 获取参数
    let name = req.query.name;

    // 判断参数是否完整
    if (!nil({ name })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let projects = await projectService.searchProject("", name);
    if (projects !== null) {
      res.send(resultUtil.success("查找成功", { projects }));
    } else {
      res.send(resultUtil.reject("查找失败"));
    }
  });

  app.get("/project/searchContainMine", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let name = req.query.name;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ name })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let projects = await projectService.searchProject(account, name);
    if (projects !== null) {
      res.send(resultUtil.success("查找成功", { projects }));
    } else {
      res.send(resultUtil.reject("查找失败"));
    }
  });

  app.get("/project/mine", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;

    if (!checkUser(account, token, res)) {
      return;
    }

    let projects = await projectService.getProjctByAccount(account, true);
    if (projects !== null) {
      res.send(resultUtil.success("获取成功", { projects }));
    } else {
      res.send(resultUtil.reject("获取失败"));
    }
  });

  app.get("/project/searchByUser", async function (req, res) {
    // 获取参数
    let account = req.query.account;

    // 判断参数是否完整
    if (!nil({ account })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let projects = await projectService.getProjctByAccount(account, false);
    if (projects !== null) {
      res.send(resultUtil.success("查找成功", { projects }));
    } else {
      res.send(resultUtil.reject("查找失败"));
    }
  });
}
