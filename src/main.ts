import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { openWebSocket } from "./common/websocket";
// import fs from "fs";
// import netUtil from "./utils/netUtil.js";
// import constUtil from "./utils/constUtil.js";
// import logUtil from "./utils/logUtil.js";

let app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

let staticUrl = path.resolve("webapp/");

// 过滤器
// import requestFilter from "./filter/requestFilter";
import forwardFilter from "./filter/forwardFilter";
forwardFilter.use(app);
// app.use(requestFilter.requestFilter);

// 转发
// function forwardFile(source, aim) {
//   app.get(source, function (req, res) {
//     if (aim == null) {
//       res.sendStatus(404);
//       res.send();
//     } else {
//       netUtil.returnResources(aim, res);
//     }
//   });
// }

// forwardFile('/', path.join(staticUrl, 'faker.html'));
// forwardFile('/index.html', null);
// forwardFile('/login.html', null);
// forwardFile('/warning.html', null);

// 静态资源目录
app.use(express.static(staticUrl));

// 控制器
import {
  userController,
  projectController,
  videoController,
  algorithmController,
} from "./net";
userController(app);
projectController(app);
videoController(app);
algorithmController(app);

// import projectController from "./controller/projectController.js";
// import otherController from "./controller/otherController.js";
// projectController.run(app);
// otherController.run(app);

// 端口
let port = 3365;

openWebSocket(3001);
app.listen(port);
console.log(`local test  : http://localhost:${3365}`);
// console.log("server test : http://159.75.249.227:8848");
console.log();

// 记录当前进程号
// let pid = process.pid;
// fs.writeFileSync("log/pid.log", "" + pid);
