import { log } from "../common/log";

const fileSuffix = [".js", ".css", ".html", ".jpg", ".jpeg", ".png", ".ico"];

function responseFilter(req, res, next) {
  res.sendl = res.send;
  let url = req._parsedUrl.pathname;
  for (let i = 0; i < fileSuffix.length; i++) {
    if (url.endsWith(fileSuffix[i])) {
      next();
      return;
    }
  }
  res.sendl = (data: { [key: string]: any }) => {
    res.send({
      LID: req.logId,
      ...data,
    });
    if (data.flag) {
      log.info(
        "Response",
        `LID: ${req.logId} DATA: ${JSON.stringify({
          flag: data.flag,
          code: data.code,
          message: data.message,
        })}`
      );
    }
  };
  next();
}

function use(app) {
  app.use(responseFilter);
}

export default {
  use,
};
