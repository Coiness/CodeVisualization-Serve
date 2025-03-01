import { Router, Request, Response } from "express";
import * as messageService from "../service/messageService";
import resultUtil from "./resultUtil";

export function messageController(app) {
  app.post("/message/send", async (req: Request, res: Response) => {
    console.log("message send调用");
    const content = req.body.content;
    const account = req.body.account as string;
    const slug = req.body.slug as string;
    if (!content || !account || !slug) {
      console.log("缺少参数");
      res.send(resultUtil.reject("缺少参数"));

      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("message send net");
    if (!content || !account || !slug) {
      console.log("缺少参数");
      res.send(resultUtil.reject("缺少参数"));
    } else {
      try {
        await messageService.sendMessageService(
          content,
          slug,
          () => messageService.terminateMessageService(slug),
          res
        );
      } catch (error) {
        console.error("Message send error:", error);
        res.end();
      }
    }
  });

  app.get("/message/get", async (req: Request, res: Response) => {
    const slug = req.headers.slug;
    if (slug == undefined) {
      res.send(resultUtil.reject("缺少参数"));
      return;
    }
    console.log("Net层 调用MessageGet slug = ", slug);
    const messages = await messageService.GetMessages(slug as string);
    if (messages) {
      res.send(resultUtil.success("获取消息成功", messages));
    } else {
      res.send(resultUtil.reject("获取消息失败"));
    }
  });

  app.post("/message/terminate", async (req: Request, res: Response) => {
    try {
      console.log("Net层调用terminate");
      const slug = req.body.slug;
      const account = req.cookies.account;
      const token = req.headers.token;
      if (!slug || !account || !token) {
        console.log("缺少参数");
        res.send(resultUtil.reject("缺少参数"));
        return;
      }
      console.log("Net层调用terminate slug = ", slug);
      const result = await messageService.terminateMessageService(slug);
      if (result) {
        res.send(resultUtil.success("终止成功"));
      } else {
        res.send(resultUtil.reject("终止失败"));
      }
    } catch (error) {
      console.error("终止会话错误", error);
      res.send(resultUtil.reject("服务器异常"));
    }
  });
}
