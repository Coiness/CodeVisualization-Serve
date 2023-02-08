import * as videoDao from "../dao/videoDao";
import * as userService from "./userService";
import { Video } from "../pojo";

export async function createVideo(
  account: string,
  name: string,
  snapshot: string
) {
  let time = Date.now();
  let p = new Video(0, name, account, snapshot, time, 0);
  let res = await videoDao.addVideo(p);
  return res;
}

export async function removeVideo(id: string) {
  return videoDao.deleteVideo(id);
}

export async function getVideoInfo(id: string) {
  let p = await videoDao.getVideoById(id);
  if (p === null) {
    return null;
  }
  let r: { [key: string]: any } = { ...p };
  r.user = await userService.getUserInfo(r.account);
  return r;
}

export async function searchVideo(account: string, name: string) {
  let ps = await videoDao.getVideosByName(name, account);
  if (ps === null) {
    return null;
  }
  let res: any = [];
  for (let item of ps) {
    let o: { [key: string]: any } = { ...item };
    o.user = await userService.getUserInfo(account);
    res.push(o);
  }
  return res;
}

export async function getVideoByAccount(account: string, isSelf: boolean) {
  let ps = await videoDao.getVideosByAccount(account, !isSelf);
  if (ps === null) {
    return null;
  }
  let res: any = [];
  for (let item of ps) {
    let o: { [key: string]: any } = { ...item };
    o.user = await userService.getUserInfo(account);
    res.push(o);
  }
  return res;
}

export async function updateVideoName(id: string, name: string) {
  let r = await videoDao.updateVideo(id, ["videoName"], [name]);
  return r;
}

export async function updateVideoPermission(id: string, permission: number) {
  let r = await videoDao.updateVideo(id, ["permission"], [permission]);
  return r;
}
