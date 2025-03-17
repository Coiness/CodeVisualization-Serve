import resultUtil from "./resultUtil";
import { nil } from "../common";
import { checkToken } from "../service";

//检查对象的登录信息是否存在
export function checkUser(account, token, res) {
  console.log("checkUser", account, token);
  if (!nil({ account })) {
    console.log("noLogin");
    res.sendl(resultUtil.noLogin());
    return false;
  }

  if (!nil({ token })) {
    console.log("token为空");
    res.sendl(resultUtil.noLogin());
    return false;
  }

  
  if (!checkToken(account, token)) {
    console.log("tokenError");
    res.sendl(resultUtil.tokenError());
    return false;
  }

  return true;
}
