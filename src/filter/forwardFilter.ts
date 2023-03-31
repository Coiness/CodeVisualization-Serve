import * as path from "path";
import netUtil from "../net/netUtil";

let staticUrl = path.resolve("webapp/");

let routes = [
  "/project",
  "/projectCenter",
  "/videoPlay",
  "/videoCenter",
  "/algorithmEdit",
  "/algorithmCenter",
  "/userInfo",
];

function use(app) {
  // 转发
  function forwardFile(source, aim) {
    app.get(source, function (req, res) {
      if (aim == null) {
        res.sendStatus(404);
        res.send();
      } else {
        res.set({
          "Content-Type": "text/html",
        });
        netUtil.returnResources(aim, res);
      }
    });
  }

  for (let i = 0; i < routes.length; i++) {
    forwardFile(routes[i], path.join(staticUrl, "index.html"));
  }
}

export default {
  use,
};
