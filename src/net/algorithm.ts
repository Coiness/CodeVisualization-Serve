import * as algorithmsService from "../service/algorithmService";
import { nil } from "../common";
import resultUtil from "./resultUtil";
import { checkUser } from "./checkUser";

/*
 *nil(obj) 检查对象是否存在空值
 *resultUtil 返回结果工具(成功、失败、账号异常、未登录、登录过期、参数缺失、权限不足)
 *checkUser 检查用户是否登录
 */

export function algorithmController(app) {
  //创建算法
  // 获取参数 => 判断用户是否登录 => 判断参数是否完整 => 开始创建 => 返回结果
  app.post("/algorithm/create", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let name = req.body.name;
    let content = req.body.content;
    let descrition = req.body.descrition;

    // 判断用户是否登录
    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ name, content, descrition })) {
      res.sendl(resultUtil.paramsError());
      return;
    }

    // 开始创建
    let id = await algorithmsService.createAlgorithm(
      account,
      name,
      content,
      descrition
    );

    // 返回结果
    if (id) {
      res.sendl(resultUtil.success("创建成功", { id }));
    } else {
      res.sendl(resultUtil.reject("创建失败"));
    }
  });

  app.post("/algorithm/remove", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.body.id;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ id })) {
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithm = await algorithmsService.getAlgorithmInfo(id);
    if (algorithm === null) {
      res.sendl(resultUtil.reject("要删除的东西不存在"));
      return;
    }
    if (algorithm.account !== account) {
      res.sendl(resultUtil.identityError());
      return;
    }

    let flag = await algorithmsService.removeAlgorithm(id);

    if (flag) {
      res.sendl(resultUtil.success("删除成功"));
    } else {
      res.sendl(resultUtil.reject("删除失败"));
    }
  });

  app.post("/algorithm/rename", async function (req, res) {
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
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithm = await algorithmsService.getAlgorithmInfo(id);
    if (algorithm === null) {
      res.sendl(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (algorithm.account !== account) {
      res.sendl(resultUtil.identityError());
      return;
    }

    let flag = await algorithmsService.updateAlgorithmName(id, name);

    if (flag) {
      res.sendl(resultUtil.success("修改成功"));
    } else {
      res.sendl(resultUtil.reject("修改失败"));
    }
  });

  app.post("/algorithm/updateDescrition", async function (req, res) {
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
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithm = await algorithmsService.getAlgorithmInfo(id);
    if (algorithm === null) {
      res.sendl(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (algorithm.account !== account) {
      res.sendl(resultUtil.identityError());
      return;
    }

    let flag = await algorithmsService.updateAlgorithmDescrition(
      id,
      descrition
    );

    if (flag) {
      res.sendl(resultUtil.success("修改成功"));
    } else {
      res.sendl(resultUtil.reject("修改失败"));
    }
  });

  app.post("/algorithm/updatePermission", async function (req, res) {
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
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithm = await algorithmsService.getAlgorithmInfo(id);
    if (algorithm === null) {
      res.sendl(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (algorithm.account !== account) {
      res.sendl(resultUtil.identityError());
      return;
    }

    let flag = await algorithmsService.updateAlgorithmPermission(
      id,
      permission
    );

    if (flag) {
      res.sendl(resultUtil.success("修改成功"));
    } else {
      res.sendl(resultUtil.reject("修改失败"));
    }
  });

  app.post("/algorithm/save", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.body.id;
    let content = req.body.content;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ id, content })) {
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithm = await algorithmsService.getAlgorithmInfo(id);
    if (algorithm === null) {
      res.sendl(resultUtil.reject("要保存的东西不存在"));
      return;
    }
    if (algorithm.account !== account) {
      res.sendl(resultUtil.identityError());
      return;
    }

    let flag = await algorithmsService.updateAlgorithmContent(id, content);

    if (flag) {
      res.sendl(resultUtil.success("保存成功"));
    } else {
      res.sendl(resultUtil.reject("保存失败"));
    }
  });

  app.get("/algorithm/loadInfo", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.query.id;

    // 判断参数是否完整
    if (!nil({ id })) {
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithm = await algorithmsService.getAlgorithmInfo(id);

    if (algorithm === null) {
      res.sendl(resultUtil.reject("不存在"));
      return;
    }

    if (algorithm.permission !== 0) {
      res.sendl(resultUtil.success("获取成功", algorithm));
      return;
    }

    if (!checkUser(account, token, res)) {
      return;
    }

    if (algorithm.account !== account) {
      res.sendl(resultUtil.identityError());
      return;
    }

    res.sendl(resultUtil.success("获取成功", algorithm));
  });

  app.get("/algorithm/search", async function (req, res) {
    // 获取参数
    let name = req.query.name;

    // 判断参数是否完整
    if (!nil({ name })) {
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithms = await algorithmsService.searchAlgorithm("", name);
    if (algorithms !== null) {
      res.sendl(resultUtil.success("查找成功", { algorithms }));
    } else {
      res.sendl(resultUtil.reject("查找失败"));
    }
  });

  app.get("/algorithm/searchContainMine", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let name = req.query.name;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ name })) {
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithms = await algorithmsService.searchAlgorithm(account, name);
    if (algorithms !== null) {
      res.sendl(resultUtil.success("查找成功", { algorithms }));
    } else {
      res.sendl(resultUtil.reject("查找失败"));
    }
  });

  app.get("/algorithm/mine", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;

    if (!checkUser(account, token, res)) {
      return;
    }

    let algorithms = await algorithmsService.getProjctByAccount(account, true);
    if (algorithms !== null) {
      res.sendl(resultUtil.success("获取成功", { algorithms }));
    } else {
      res.sendl(resultUtil.reject("获取失败"));
    }
  });

  app.get("/algorithm/searchByUser", async function (req, res) {
    // 获取参数
    let account = req.query.account;

    // 判断参数是否完整
    if (!nil({ account })) {
      res.sendl(resultUtil.paramsError());
      return;
    }

    let algorithms = await algorithmsService.getProjctByAccount(account, false);
    if (algorithms !== null) {
      res.sendl(resultUtil.success("查找成功", { algorithms }));
    } else {
      res.sendl(resultUtil.reject("查找失败"));
    }
  });
}
