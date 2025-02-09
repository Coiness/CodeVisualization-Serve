import * as chatsService from "../service/chatsService";
import { nil } from "../common";
import resultUtil from "./resultUtil";
import { checkUser } from "./checkUser";
import { Chats } from "../pojo";

export function chatsController(app) {
  //获取对话列表
  app.get("chat/list", async function (req, res) {
    let token = req.headers.token;
    let account = req.cookies.account;

    //判断用户是否登录
    if (!checkUser(account, token, res)) {
      return;
    }

    //获取对话列表
  });

  //创建聊天
  // 获取参数 => 判断用户是否登录 => 判断参数是否完整 => 开始创建 => 返回结果
  app.post("/chats/create", async function (req, res) {
    //获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let title = req.body.title;

    //判断用户是否登录
    if (!checkUser(account, token, res)) {
      return;
    }

    //判断参数是否完整
    if (nil({ title })) {
      res.send(resultUtil.paramsError());
      return;
    }

    //开始创建
    let id: number | boolean = await chatsService.createChats(account, title);

    //返回结果
    if (id) {
      res.send(resultUtil.success("对话创建成功", { id }));
    } else {
      res.send(resultUtil.reject("对话创建失败"));
    }
  });

  //更新对话title
  //获取参数 => 判断用户是否登录 => 判断参数是否完整 => 开始更新 => 返回结果
  app.post("/chats/update", async function (req, res) {
    //获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let title = req.body.title;
    let id = req.body.id;

    //判断用户是否登录
    if (!checkUser(account, token, res)) {
      return;
    }

    //判断参数是否完整
    if (nil({ title, id })) {
      res.send(resultUtil.paramsError());
      return;
    }

    //开始更新
    let result = await chatsService.updateChats(id, title);

    //返回结果
    if (result) {
      res.send(resultUtil.success("更新成功"));
    } else {
      res.send(resultUtil.reject("更新失败"));
    }
  });

  //删除聊天
  //获取参数 => 判断用户是否登录 => 判断参数是否完整 => 开始删除 => 返回结果
  app.post("/chats/remove", async function (req, res) {
    //获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let id = req.body.id;

    //判断用户是否登录
    if (!checkUser(account, token, res)) {
      return;
    }

    //判断参数是否完整
    if (nil({ id })) {
      res.send(resultUtil.paramsError());
      return;
    }

    //开始删除
    let result = await chatsService.deleteChats(id);

    //返回结果
    if (result) {
      res.send(resultUtil.success("删除成功"));
    } else {
      res.send(resultUtil.reject("删除失败"));
    }
  });

  //获取用户聊天列表
  //获取参数 => 判断用户是否登录 => 判断参数是否完整 => 开始获取 => 返回结果
  app.post("/chats/list", async function (req, res) {
    //获取参数
    let token = req.headers.token;
    let account = req.cookies.account;

    //判断用户是否登录
    if (!checkUser(account, token, res)) {
      return;
    }

    //判断参数是否完整
    if (nil({ account })) {
      res.send(resultUtil.paramsError());
      return;
    }

    //开始获取
    let chats: Chats[] = await chatsService.getChatsByAccount(account);

    //返回结果
    if (chats) {
      res.send(resultUtil.success("获取成功", chats));
    } else {
      res.send(resultUtil.reject("获取失败"));
    }
  });
}
