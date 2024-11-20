import * as fs from "fs";
import * as path from "path";

class Log {
  private path: string;

  // 存储日志文件的路径
  constructor(path: string) {
    this.path = path;
  }

  private getTime() {
    return new Date().toLocaleString();
  }

  // 将日志写入文件
  private write(msg: string) {
    fs.writeFile(this.path, msg, { flag: "a" }, () => {});
  }

  // 记录日志
  private log(key: string, msg: string, type: string) {
    this.write(`${type} | ${this.getTime()}\t| ${key}\t| ${msg}\n`);
  }

  // 记录不同级别的日志
  info(key: string, msg: string) {
    this.log(key, msg, "INFO ");
  }

  // 记录警告
  warning(key: string, msg: string) {
    this.log(key, msg, "WARN ");
  }

  // 记录错误
  error(key: string, msg: string) {
    this.log(key, msg, "ERROR");
  }
}

export const log = new Log(path.resolve("logs/common.log"));
