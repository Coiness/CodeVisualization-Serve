import * as fs from "fs";
import * as path from "path";
import { getMimeType } from "../common";

let basePath = path.resolve("./runTime/");

function randomFileName() {
  return Date.now();
}

export async function uploadImage(file) {
  let fileName = randomFileName() + "." + file.originalname.split(".").pop();
  let url = "/image/get?fileName=" + fileName;
  let target = path.resolve(basePath, "resource", fileName);

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
  let target = path.resolve(basePath + fileName);
  let mimeType = getMimeType(fileName.split(".").pop());
  res.setHeader("Content-Type", mimeType + ";charset=utf-8");
  returnResources(target, res);
}

function returnResources(path, res) {
  fs.readFile(path, function (err, doc) {
    if (err == null) {
      res.send(doc);
    } else {
      console.log(err);
    }
  });
}
