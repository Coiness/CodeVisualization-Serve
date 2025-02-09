import { Router, Request, Response } from "express";
import * as messageService from "../service/messageService";

const router = Router();

router.post("/message/send", async (req: Request, res: Response) => {
  const { content } = req.body;
  const token = req.headers.token as string;
  const account = req.headers.account as string;

  // 设置流式响应头
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    await messageService.handleStreamMessage(content, account, token, res);
  } catch (error) {
    console.error("Message send error:", error);
    res.end();
  }
});

export default router;
