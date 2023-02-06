import { addUser, getUser, updateUser, getAllUser } from "../dao";
import { md5, WEEK } from "../common";
import { User } from "../pojo";

const DefauleImg = "";

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
  return t === nt;
}

export async function register(account, pwd) {
  let user = await getUser(account);
  if (user !== null) {
    return null;
  }
  pwd = md5(pwd);
  let token = createToken(account);
  let u = new User(account, pwd, `用户${account}`, DefauleImg, token);
  let res = await addUser(u);
  if (res) {
    return u;
  } else {
    return null;
  }
}

export async function login(account, pwd): Promise<User | null> {
  let user = await getUser(account);
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
  let user = await getUser(account);
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
