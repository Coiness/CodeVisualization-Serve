import { Router, Request, Response } from "express";
import * as messageService from "../service/messageService";
import resultUtil from "./resultUtil";

export function messageController(app) {
  app.post("/message/send", async (req: Request, res: Response) => {
    console.log("message send调用");
    const { content } = req.body;
    const slug = "1512133221-at-qq-dot-com2025-02-24T110624-dot-683Z";
    const account = "1512133221@qq.com";
    //const account = req.body.account as string;
    //const slug = req.body.slug as string;
    console.log(req.body);
    console.log("content:", content, "account:", account, "slug:", slug);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("message send net");
    console.log(!content || !account || !slug);
    if (!content || !account || !slug) {
      console.log("缺少参数");
      res.send(resultUtil.reject("缺少参数"));
    } else {
      try {
        await messageService.sendMessageService(content, slug, res);
      } catch (error) {
        console.error("Message send error:", error);
        res.end();
      }
    }
  });

  app.get("/message/get", async (req: Request, res: Response) => {
    console.log("朕的slug捏?");
    console.log("req.body :", req.body);
    console.log("req.headers :", req.headers);
    const slug = req.body.slug;
    console.log("Net层 调用MessageGet slug = ", slug);
    const messages = await messageService.GetMessages(slug as string);
    if (messages) {
      res.send(resultUtil.success("获取消息成功", messages));
    } else {
      res.send(resultUtil.reject("获取消息失败"));
    }
  });
}
