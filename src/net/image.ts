import * as multer from "multer";
import { checkUser } from "./checkUser";
import { nil } from "../common";
import resultUtil from "./resultUtil";
import * as imageService from "../service/imageService";

const upload = multer({ dest: "upload_tmp/" });

export function imageController(app) {
  // 上传图片
  app.post("/image/upload", upload.any(), async function (req, res) {
    // 获取参数
    let token = req.headers.token;
    let account = req.cookies.account;
    let file = req.files[0];

    // 检验用户身份
    if (!checkUser(account, token, res)) {
      return;
    }

    // 判断参数是否完整
    if (!nil({ file })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始上传
    let url = await imageService.uploadImage(file);

    // 返回结果
    if (url) {
      res.send(resultUtil.success("上传成功", { url }));
    } else {
      res.send(resultUtil.reject("上传失败"));
    }
  });

  app.get("/image/get", async function (req, res) {
    // 获取参数
    let fileName = req.query.fileName;

    // 判断参数是否完整
    if (!nil({ fileName })) {
      res.send(resultUtil.paramsError());
      return;
    }

    // 开始获取文件
    imageService.getImage("/resource/" + fileName, res);
  });
}
