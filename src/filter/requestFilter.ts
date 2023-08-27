import { log } from "../common/log";
import { createOnlyId } from "../common/onlyId";
const fileSuffix = [".js", ".css", ".html", ".jpg", ".jpeg", ".png", ".ico"];

function requestFilter(req, res, next) {
  let url = req._parsedUrl.pathname;
  for (let i = 0; i < fileSuffix.length; i++) {
    if (url.endsWith(fileSuffix[i])) {
      next();
      return;
    }
  }

  let method = req.method;

  let data: { [key: string]: { [key: string]: string } } = {};
  for (let attr in req.headers) {
    if (attr == "content-type" || attr == "token") {
      if (!data.header) {
        data.header = {};
      }
      data.header[attr] = req.headers[attr];
    }
  }
  for (let attr in req.cookies) {
    if (!data.cookies) {
      data.cookies = {};
    }
    data.cookies[attr] = req.cookies[attr];
  }
  for (let attr in req.query) {
    if (!data.query) {
      data.query = {};
    }
    data.query[attr] = req.query[attr];
  }
  for (let attr in req.body) {
    if (!data.body) {
      data.body = {};
    }
    data.body[attr] = req.body[attr];
  }

  const logId = createOnlyId("l");
  req.logId = logId;

  method = method == "GET" ? "GET   " : "POST  ";
  const str = `LID: ${logId} M: ${method} URL: ${url} DATA: ${JSON.stringify(
    data
  )}`;
  log.info("Request", str);

  next();
}

function use(app) {
  app.use(requestFilter);
}

export default {
  use,
};
