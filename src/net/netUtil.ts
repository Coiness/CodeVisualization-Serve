import * as fs from "fs";
import { log } from "../common/log";

// 返回资源
function returnResources(path, res) {
  fs.readFile(path, function (err, doc) {
    if (err == null) {
      res.send(doc);
    } else {
      log.error("Read source error", err.message);
    }
  });
}

export default {
  returnResources,
};
