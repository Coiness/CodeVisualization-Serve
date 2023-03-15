import * as userService from "../service/userService";
import { nil, MONTH } from "../common";
import resultUtil from "./resultUtil";
import { checkUser } from "./checkUser";

export function userController(app) {
  // 注册
  app.post("/user/register", async function (req, res) {
    // 获取参数
    let account = req.body.account;
    let pwd = req.body.pwd;

    // 判断参数是否完整
    if (!nil({ account, pwd })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始注册
    let flag = await userService.register(account, pwd);

    // 返回结果
    if (flag) {
      res.send(resultUtil.success("注册成功"));
    } else {
      res.send(resultUtil.reject("注册失败"));
    }
  });

  // 登录
  app.post("/user/login", async function (req, res) {
    // 获取参数
    let account = req.body.account;
    let pwd = req.body.pwd;

    // 判断参数是否完整
    if (!nil({ account, pwd })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始登录
    let user = await userService.login(account, pwd);

    // 返回结果
    if (user !== null) {
      // cookie添加账号
      res.cookie("account", account, {
        maxAge: MONTH,
        httpOnly: true,
      });

      res.send(
        resultUtil.success("登录成功", {
          token: user.token,
        })
      );
    } else {
      res.send(resultUtil.reject("登录失败"));
    }
  });

  // 获取用户信息
  app.get("/user/getUserInfo", async function (req, res) {
    // 获取参数
    let account = req.query.account;

    // 获取数据
    let info = await userService.getUserInfo(account);

    // 返回结果
    if (info) {
      res.send(resultUtil.success("获取成功", info));
    } else {
      res.send(resultUtil.reject("获取失败"));
    }
  });

  // 修改密码
  // app.post("/user/modifyPassword", async function (req, res) {
  //   // 获取参数
  //   let token = req.headers.token;
  //   let account = req.cookies.account;
  //   let oldPwd = req.body.oldPwd;
  //   let newPwd = req.body.newPwd;

  //   // 检验用户身份
  //   if (!checkUtil.checkUser(account, token, res)) {
  //     return;
  //   }

  //   // 判断参数是否完整
  //   if (!nil({ oldPwd, newPwd })) {
  //     res.send(resultUtil.paramsError());
  //     return;
  //   }

  //   // 开始修改
  //   let flag = await userService.modifyPwd(account, oldPwd, newPwd);

  //   // 返回结果
  //   if (flag) {
  //     res.send(resultUtil.success("修改成功"));
  //   } else {
  //     res.send(resultUtil.reject("修改失败"));
  //   }
  // });

  // 修改用户名
  app.post("/user/modifyUsername", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let username = req.body.username;

    // 检验用户身份
    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ username })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始修改
    let flag = await userService.modifyUserName(account, username);

    // 返回结果
    if (flag) {
      res.send(resultUtil.success("修改成功"));
    } else {
      res.send(resultUtil.reject("修改失败"));
    }
  });

  // 关注
  app.post("/user/follow", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let followAccount = req.body.followAccount;

    // 检验用户身份
    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ followAccount })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始修改
    let flag = await userService.follow(account, followAccount);

    // 返回结果
    if (flag) {
      res.send(resultUtil.success("关注成功"));
    } else {
      res.send(resultUtil.reject("关注失败"));
    }
  });

  // 取消关注
  app.post("/user/removeFollow", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let followAccount = req.body.followAccount;

    // 检验用户身份
    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ followAccount })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始修改
    let flag = await userService.removeFollow(account, followAccount);

    // 返回结果
    if (flag) {
      res.send(resultUtil.success("取消关注成功"));
    } else {
      res.send(resultUtil.reject("取消关注失败"));
    }
  });

  // 获取关注列表
  app.get("/user/followList", async function (req, res) {
    // 获取参数
    let account = req.query.account;

    // 判断参数是否完整
    if (!nil({ account })) {
      res.send(resultUtil.paramsError());
      return;
    }

    let list = await userService.getFollowList(account);
    let result = list.map((item) => {
      return {
        account: item.account,
        username: item.name,
        img: item.img,
      };
    });

    // 返回结果
    if (list) {
      res.send(resultUtil.success("获取成功", { list: result }));
    } else {
      res.send(resultUtil.reject("获取失败"));
    }
  });

  // 获取粉丝列表
  app.get("/user/fansList", async function (req, res) {
    // 获取参数
    let account = req.query.account;

    // 判断参数是否完整
    if (!nil({ account })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始修改
    let list = await userService.getFansList(account);
    let result = list.map((item) => {
      return {
        account: item.account,
        username: item.name,
        img: item.img,
      };
    });

    // 返回结果
    if (list) {
      res.send(resultUtil.success("获取成功", { list: result }));
    } else {
      res.send(resultUtil.reject("获取失败"));
    }
  });

  // 获取和某用户的关注信息
  app.get("/user/getFollowInfo", async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let followAccount = req.query.followAccount;

    // 检验用户身份
    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ followAccount })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始修改
    let followed = await userService.isFollow(account, followAccount);
    let reverseFollowed = await userService.isFollow(followAccount, account);

    // 返回结果
    res.send(resultUtil.success("获取成功", { followed, reverseFollowed }));
  });
}
