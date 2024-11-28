import resultUtil from "./resultUtil";
import { nil } from "../common";
import { checkToken } from "../service";

//检查对象的登录信息是否存在
export function checkUser(account, token, res) {
  if (!nil({ account })) {
    res.sendl(resultUtil.noLogin());
    return false;
  }

  if (!nil({ token })) {
    res.sendl(resultUtil.noLogin());
    return false;
  }

  if (!checkToken(account, token)) {
    res.sendl(resultUtil.tokenError());
    return false;
  }

  return true;
}
