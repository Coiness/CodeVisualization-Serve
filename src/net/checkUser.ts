import resultUtil from "./resultUtil";
import { nil } from "../common";
import { checkToken } from "../service";

export function checkUser(account, token, res) {
  if (!nil({ account })) {
    res.send(resultUtil.noLogin());
    return false;
  }

  if (!nil({ token })) {
    res.send(resultUtil.noLogin());
    return false;
  }

  if (!checkToken(account, token)) {
    res.send(resultUtil.tokenError());
    return false;
  }

  return true;
}
