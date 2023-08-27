import * as fs from "fs";
import * as path from "path";

class Log {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  private getTime() {
    return new Date().toLocaleString();
  }

  private write(msg: string) {
    fs.writeFile(this.path, msg, { flag: "a" }, () => {});
  }

  private log(key: string, msg: string, type: string) {
    this.write(`${type} | ${this.getTime()}\t| ${key}\t| ${msg}\n`);
  }

  info(key: string, msg: string) {
    this.log(key, msg, "INFO ");
  }

  warning(key: string, msg: string) {
    this.log(key, msg, "WARN ");
  }

  error(key: string, msg: string) {
    this.log(key, msg, "ERROR");
  }
}

export const log = new Log(path.resolve("logs/common.log"));
