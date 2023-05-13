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
import { check } from "./emailCheckCodeService";

const DefauleImg =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJkAmQMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAgMGB//EADMQAAICAAMGBAYBAwUAAAAAAAABAgMEESEFEiIxQVETMnGRUmGBobHRwRRykhUjM0NT/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APtIAAAGJSUU3JpJdWwMnO26ulZ2TSIGJ2k3nGjRfG/4K+Tcpb0m231YFlbtRcqa/rJ/wRZ47ET/AOzJdo6EYAbuyyXmsk/Vs1zeerfuYAG8bJx8spL0kzrDG4iHKxtdnqRwBY1bUfK2tesf0TqMRVcuCaz7PRlAZz1zz1A9GCpw20JQe7ct+Pfqi0rshbHfrkpR7oDYAAAAAAMSkoxcpPJJZtga2WQqg52PJIpsVi54l9odF+xjMTLEWZ8oR8q/kjgAAAAAAAAAAAAAA64bEWYee9BrLrHozkAL+i+F8N+H1XVHUoMPfOizfjy6ruXlVkba4zhrGSA3AAArNq4ji8CPJaz/AET77VTVKx9EUDblJylzbzYGAAAAAAyZhFzmoxTbfItsLhIUJOS3rPiAr6sHfPXd3V3lodf9Nsy/5IZ+jLMAVNmBugtIqXoyM01zT0L844jDQvTzWUukkBSg3trlVNwmsmvuaAAAAJmzcR4VvhzfBN+zIYA9ICPgbvHw6k3xLhl6kgCu2vbpCperKwk7Qnv4uzssoojAAAAAAFnsynKDuktXpH0JppTHcpriukUbgAAAAAEXaNKsp315ofgqT0DSaaa0ZQNZNrsBgAAAABO2Vbu3yg+U190W2R5+ifh31y7STL/QDz9r3rJy7ybNDLMAAAAD5AAX1b3q4y7pM2ImzbVOncz4oafQlgAAAAADPLV9NShlrJvuy2x1qqw714paIpwABkDBkGAMss/6v5lWbZyAWR3bJR7No1JGOhuYuxdG819SOAAAAAAdKbZU2KcOa6dy4ouhfBSg9eq6oozaE5wnnBtPuuoF8CFTicQ/Nh3Jd1p+SR4tmWfgT90B1NLbYVQcpyyX5I92IxCXBh2vm9fwV1tlk5Z2yk5fPoBtib3fZvSzSXJHEAAZRgAZMAACx/pH2fsQqIb90IrrJHoMkBW7Xr1hav7WVpf4mpXUyh1a09Sh1XPn1AwAABlJtpJZtvRIzCMpyUYrOT6FvhcLGhZ5Jza1YEbD7PcuK/hXwp6k2qmupf7cFE3AGTAAA1nXCa44qXqjYAQL9nLnQ3/a/wBlfKLhJxkmmueZfnLE4eGIhxaSXKXYCkBvbXKqbhJZNGgAAATtlVuV8p/AtPVltmR8BT4OHSa4pcTJAAqdp4fcn4sVwy5/Jlsa2QjZCUJLNNZAedB2xNEqLXGWqflfdGlLgrYOzPcz1As9n4fwq9+S45fZEoxGSkk4tNPlkZAAAAAAAAAAACPjcP49TaXGuTKh6adi/bS5vIpcXKuWInKvkwOJL2dh3ddvSXBDn832OFNUrrFCCzbLyiqNNahHkuvcDoAAAAA5YimF9e5P6PqilxFFmHm42L0kupfmltcLYblkVKLApcNiZ0ctY9YlpRiK71wPi6xfNEHFYCyrOVfHD01RD5ZPqmBfgqqsfdDz5TXz5+5Kr2hTLzb0X81mBLByjiaJcrYfV5G/i1/+kP8AIDYHOWIpjzth7nGePpiuHek/kgJRpddXSs7JJdl1ZXW7Qtn5EofdkSUm3nJtvuwJGJxcr9FwwXTucqap3TUILNv7HfDYGy9qT4K/ifUtaKYUQ3YL1fcDXDYaGHhurWT5yOwAAAAAAAAAAj34Om/WUcpfFHmSABU3bNti34cozXsyLOi2t8dcl9D0HQLkB5sfQtMb1K2XNgam8KrJvgrlL0ROwfNFlHygVNWzrp5eJlBe7J2HwVNOu65SXWRJ6AAAAABhgZBgyB//2Q==";

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

// todo
export async function getCheckCode() {}

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
  let u = new User(
    account,
    pwd,
    `用户${account}`,
    DefauleImg,
    token,
    invitationCode
  );
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
