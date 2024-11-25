import * as fs from "fs";
import * as path from "path";
import { getMimeType } from "../common";

/*
 *fs用于文件系统相关操作
 *path用于处理文件路径
 *getMineType用于获取文件的Mime了下
 */

//定义基础路径
let basePath = path.resolve(__dirname, "../runTime/");
console.log(basePath);

//生成一个基于当前时间戳的唯一文件名
function randomFileName() {
  return Date.now();
}

//接收上传的图片文件，返回图片的URL
export async function uploadImage(file) {
  let fileName = randomFileName() + "." + file.originalname.split(".").pop(); //生成文件名
  let url = "/image/get?fileName=" + fileName; //生成URL（客户端访问）
  let target = path.resolve(basePath, "resource", fileName); //生成文件路径

  fs.readFile(path.resolve(file.path), function (err, data) {
    // 异步读取文件内容
    fs.writeFile(target, data, function (err) {
      // des_file是文件名，data，文件数据，异步写入到文件
      fs.rm(path.resolve(file.path), function (err) {});
    });
  });

  return url;
}

export async function getImage(fileName, res) {
  console.log("正在执行getImage");
  let target = path.resolve(basePath, "resource", fileName);
  target = path.join(basePath, fileName);
  console.log(basePath);
  console.log(target);
  let mimeType = getMimeType(fileName.split(".").pop());
  res.setHeader("Content-Type", mimeType + ";charset=utf-8");
  console.log(target); // /home/coiness/Project-代码视界/backend/runTime/resource/Default.jpg
  console.log(mimeType); // image/jpeg
  returnResources(target, res);
}

function returnResources(path, res) {
  console.log(path); // /home/coiness/Project-代码视界/backend/runTime/resource/Default.jpg
  fs.readFile(path, function (err, doc) {
    if (err == null) {
      res.send(doc);
    } else {
      console.log(err);
      console.log("出错了");
    }
  });
}
