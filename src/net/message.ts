import { Router, Request, Response } from "express";
import * as messageService from "../service/messageService";
import resultUtil from "./resultUtil";

export function messageController(app) {
  app.post("/message/send", async (req: Request, res: Response) => {
    const { content } = req.body.content;
    const token = req.headers.token as string;
    const slug = req.headers.slug as string;

    if (!content || !token || !slug) {
      res.send(resultUtil.reject("缺少参数"));
      // 设置流式响应头
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      try {
        await messageService.handleStreamMessage(content, slug, res);
      } catch (error) {
        console.error("Message send error:", error);
        res.end();
      }
    }
  });

  app.get("/message/get", async (req: Request, res: Response) => {
    const slug = req.body.slug;
    const messages = await messageService.GetMessages(slug as string);
    if (messages) {
      res.send(resultUtil.success("获取消息成功", messages));
    } else {
      res.send(resultUtil.reject("获取消息失败"));
    }
  });
}
