import { Response } from "express";
import { callUpstreamSse } from "../dao";
import type { Response as FetchResponse } from "node-fetch";
import { getMessages } from "../dao/anythingLLM";

export async function sendMessageService(
  content: string,
  slug: string,
  res: Response
) {
  try {
    const upstreamResponse: FetchResponse = await callUpstreamSse(
      content,
      slug
    );

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      console.log("MessageService请求失败");
      res.status(500).send("请求失败");
      return;
    }

    //设置SSE头部
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const decoder = new TextDecoder();

    upstreamResponse.body.on("data", (chunk) => {
      const text = decoder.decode(chunk);
      res.write(text);
    });

    upstreamResponse.body.on("end", () => {
      res.end();
    });

    upstreamResponse.body.on("error", (err) => {
      console.error("Stream error:", err);
      res.end();
    });
  } catch (error) {
    console.error("Stream请求失败", error);
    res.status(500).send("内部服务器错误");
  }
}

export interface MessageInfo {
  chatId: number;
  content: string;
  role: "user" | "assistant";
}

export async function GetMessages(slug) {
  return await getMessages(slug);
}
