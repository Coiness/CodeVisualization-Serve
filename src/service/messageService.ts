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
    console.log("MessageService请求开始");
    console.log("content:", content);
    console.log("slug:", slug);

    // 2. 请求上游服务
    const upstreamResponse: FetchResponse = await callUpstreamSse(
      content,
      slug
    );
    console.log("上游服务请求完成");

    // 4. 转发流数据
    const decoder = new TextDecoder();
    console.log("开始转发流数据");

    upstreamResponse.body.on("data", (chunk) => {
      try {
        const text = decoder.decode(chunk);
        res.write(text);
        console.log("转发数据:", text);
      } catch (error) {
        console.error("数据处理错误:", error);
        res.write('data: {"error": "数据处理错误"}\n\n');
      }
    });

    upstreamResponse.body.on("end", () => {
      res.end();
    });

    upstreamResponse.body.on("error", (err) => {
      console.error("流错误:", err);
      res.write('data: {"error": "流处理错误"}\n\n');
      res.end();
    });
  } catch (error) {
    console.error("Stream请求失败", error);
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write('data: {"error": "内部服务器错误"}\n\n');
    }
    res.end();
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
