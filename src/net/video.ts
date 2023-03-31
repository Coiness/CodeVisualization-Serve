import * as videoService from "../service/videoService";
import { nil } from "../common";
import resultUtil from "./resultUtil";
import { checkUser } from "./checkUser";

export function videoController(app) {
  app.post("/video/create", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let name = req.body.name;
    let content = req.body.content;
    let descrition = req.body.descrition;

    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ name, content, descrition })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始注册
    let id = await videoService.createVideo(account, name, content, descrition);

    // 返回结果
    if (id) {
      res.send(resultUtil.success("创建成功", { id }));
    } else {
      res.send(resultUtil.reject("创建失败"));
    }
  });

  app.post("/video/remove", async function (req, res) {
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

    let video = await videoService.getVideoInfo(id);
    if (video === null) {
      res.send(resultUtil.reject("要删除的东西不存在"));
      return;
    }
    if (video.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await videoService.removeVideo(id);

    if (flag) {
      res.send(resultUtil.success("删除成功"));
    } else {
      res.send(resultUtil.reject("删除失败"));
    }
  });

  app.post("/video/rename", async function (req, res) {
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

    let video = await videoService.getVideoInfo(id);
    if (video === null) {
      res.send(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (video.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await videoService.updateVideoName(id, name);

    if (flag) {
      res.send(resultUtil.success("修改成功"));
    } else {
      res.send(resultUtil.reject("修改失败"));
    }
  });

  app.post("/video/updateDescrition", async function (req, res) {
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

    let video = await videoService.getVideoInfo(id);
    if (video === null) {
      res.send(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (video.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await videoService.updateVideoDescrition(id, descrition);

    if (flag) {
      res.send(resultUtil.success("修改成功"));
    } else {
      res.send(resultUtil.reject("修改失败"));
    }
  });

  app.post("/video/updatePermission", async function (req, res) {
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

    let video = await videoService.getVideoInfo(id);
    if (video === null) {
      res.send(resultUtil.reject("要修改的东西不存在"));
      return;
    }
    if (video.account !== account) {
      res.send(resultUtil.identityError());
      return;
    }

    let flag = await videoService.updateVideoPermission(id, permission);

    if (flag) {
      res.send(resultUtil.success("修改成功"));
    } else {
      res.send(resultUtil.reject("修改失败"));
    }
  });

  app.get("/video/loadInfo", async function (req, res) {
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

    let video = await videoService.getVideoInfo(id);
    if (video === null) {
      res.send(resultUtil.reject("不存在"));
      return;
    }
    if (video.account !== account && video.permission === 0) {
      res.send(resultUtil.identityError());
      return;
    }

    res.send(resultUtil.success("获取成功", video));
  });

  app.get("/video/search", async function (req, res) {
    // 获取参数
    let name = req.query.name;

    // 判断参数是否完整
    if (!nil({ name })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let videos = await videoService.searchVideo("", name);
    if (videos !== null) {
      res.send(resultUtil.success("查找成功", { videos: videos }));
    } else {
      res.send(resultUtil.reject("查找失败"));
    }
  });

  app.get("/video/searchContainMine", async function (req, res) {
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

    let videos = await videoService.searchVideo(account, name);
    if (videos !== null) {
      res.send(resultUtil.success("查找成功", { videos: videos }));
    } else {
      res.send(resultUtil.reject("查找失败"));
    }
  });

  app.get("/video/mine", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;

    if (!checkUser(account, token, res)) {
      return;
    }

    let videos = await videoService.getVideoByAccount(account, true);
    if (videos !== null) {
      res.send(resultUtil.success("获取成功", { videos: videos }));
    } else {
      res.send(resultUtil.reject("获取失败"));
    }
  });

  app.get("/video/searchByUser", async function (req, res) {
    // 获取参数
    let account = req.query.account;

    // 判断参数是否完整
    if (!nil({ account })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let videos = await videoService.getVideoByAccount(account, false);
    if (videos !== null) {
      res.send(resultUtil.success("查找成功", { videos: videos }));
    } else {
      res.send(resultUtil.reject("查找失败"));
    }
  });
}
