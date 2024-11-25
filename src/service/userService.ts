import {
  addUser,
  getUserByAccount,
  updateUser,
  addFollow,
  getFollow,
  getFollowsByAccount,
  getFollowsByFollowAccount,
  deleteFollow,
  getUserByInvitationCode,
} from "../dao";
import { md5, WEEK } from "../common";
import { User } from "../pojo";
import { checkInvitationCode } from "./invitationCodeService";
import { check, sendEmailCheckCode } from "./emailCheckCodeService";

const DefaultImg = "/image/get?fileName=Default.jpg";

const key = "60rzvvbj";
const time = WEEK; // 有效时间
const TokenSeparator = ":-:";

/**
 * 生成 token
 * @param account
 * @returns
 */
function createToken(account: string) {
  let now = Date.now();
  return `${now}${TokenSeparator}${md5(`${account}${key}${now}`)}`;
}

/**
 * 检查用户登录状态
 * @param account
 * @param token
 */
export function checkToken(account: string, token: string): boolean {
  let [d, t] = token.split(TokenSeparator);
  let date = parseInt(d);
  if (Date.now() - date > time) {
    return false;
  }
  let nt = md5(`${account}${key}${d}`);
  if (t !== nt) {
    return false;
  }

  // TODO 和数据库中 token 作对比
  // if (false) {
  //   return false;
  // }

  return true;
}

export enum RegisterErrorCode {
  Success = "success",
  CheckCodeError = "CheckCodeError", // 验证码错误
  AccountExist = "AccountExist", // 账号已存在
  InvitationCodeUsed = "InvitationCodeUsed", // 邀请码已经被使用
  InvitationCodeInvalid = "InvitationCodeInvalid", // 邀请码无效
  Other = "other", // 其它未知错误
}

export interface RegisterResult {
  code: RegisterErrorCode;
  user?: User;
}

export async function getCheckCode(account: string): Promise<boolean> {
  return sendEmailCheckCode(account);
}

export async function register(
  account: string,
  pwd: string,
  checkCode: string, // 邮箱验证码
  invitationCode: string // 邀请码
): Promise<RegisterResult> {
  let user = await getUserByAccount(account);

  // 检查邮箱是否已被注册过
  if (user !== null) {
    return { code: RegisterErrorCode.AccountExist };
  }

  // 检查邮箱验证码是否正确
  if (!check(account, checkCode)) {
    return { code: RegisterErrorCode.CheckCodeError };
  }

  // 检查邀请码是否合法
  if (!checkInvitationCode(invitationCode)) {
    return { code: RegisterErrorCode.InvitationCodeInvalid };
  }

  // 检查邀请码是否已经被使用
  user = await getUserByInvitationCode(invitationCode);
  if (user !== null) {
    return { code: RegisterErrorCode.InvitationCodeUsed };
  }

  pwd = md5(pwd);
  let token = createToken(account);
  let u = new User(account, pwd, account, DefaultImg, token, invitationCode);
  let res = await addUser(u);
  if (res) {
    return { code: RegisterErrorCode.Success, user: u };
  } else {
    return { code: RegisterErrorCode.Other };
  }
}

export async function login(account, pwd): Promise<User | null> {
  let user = await getUserByAccount(account);
  if (user === null) {
    return null;
  }
  pwd = md5(pwd);
  if (user.pwd !== pwd) {
    return null;
  }
  let token = createToken(account);
  user.token = token;
  let res = await updateUser(user.account, ["token"], [user.token]);
  if (res === false) {
    return null;
  }
  return user;
}

export async function getUserInfo(account) {
  let user = await getUserByAccount(account);
  return { username: user.name, img: user.img };
}

// async function modifyPwd(account, oldPwd, newpwd) {
//   let user = await getUser(account);
//   if (user == null) {
//     return false;
//   } else {
//     oldPwd = md5(oldPwd);
//     if (user.pwd == oldPwd) {
//       newpwd = md5(newpwd);
//       return await updateUser(account, ["pwd"], [newpwd]);
//     } else {
//       return false;
//     }
//   }
// }

export async function modifyUserName(account, name) {
  return await updateUser(account, ["username"], [name]);
}

export async function modifyUserImg(account, img) {
  return await updateUser(account, ["img"], [img]);
}

export async function follow(account: string, followAccount: string) {
  return await addFollow(account, followAccount);
}

export async function removeFollow(account: string, followAccount: string) {
  return await deleteFollow(account, followAccount);
}

export async function getFollowList(account: string): Promise<User[]> {
  let accounts = await getFollowsByAccount(account);
  let users: User[] = [];
  for (let i = 0; i < accounts.length; i++) {
    users[i] = await getUserByAccount(accounts[i]);
  }
  return users;
}

export async function getFansList(account: string) {
  let accounts = await getFollowsByFollowAccount(account);
  let users: User[] = [];
  for (let i = 0; i < accounts.length; i++) {
    users[i] = await getUserByAccount(accounts[i]);
  }
  return users;
}

export async function isFollow(account: string, followAccount: string) {
  let follow = await getFollow(account, followAccount);
  return follow !== null;
}
