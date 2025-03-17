import { Response } from "express";
import { callUpstreamSse } from "../dao";
import type { Response as FetchResponse } from "node-fetch";
import { getMessages } from "../dao/anythingLLM";
import { terminateStream } from "../dao";
import { updateChat2 } from "./chatsService";

/*
export async function sendMessageService(
  content: string,
  slug: string,
  res: Response
) {
  try {
    console.log("MessageService请求开始");

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

    upstreamResponse.body.on("error", (err) => {
      console.error("流错误:", err);
      res.write('data: {"error": "流处理错误"}\n\n');
      res.end();
    });

    upstreamResponse.body.on("end", () => {
      res.end();
    });
  } catch (error) {
    console.error("Stream请求失败", error);
    //防止响应重复发送
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write('data: {"error": "内部服务器错误"}\n\n');
    } else {
      res.end();
    }
  }
}*/

export async function sendMessageService(
  content: string,
  slug: string,
  onClientDisconnect: () => void, // 替换为回调函数
  res: Response
) {
  // 添加响应状态跟踪
  let isResponseEnded = false;
  updateChat2("assistant", slug);

  // 安全写入函数
  const safeWrite = (data: string) => {
    if (!isResponseEnded && !res.writableEnded) {
      try {
        res.write(data);
      } catch (error) {
        console.error("写入响应失败:", error);
      }
    }
  };

  // 安全结束函数
  const safeEnd = () => {
    if (!isResponseEnded && !res.writableEnded) {
      try {
        res.end();
        isResponseEnded = true;
      } catch (error) {
        console.error("结束响应失败:", error);
      }
    }
  };

  try {
    console.log("MessageService请求开始");
    const upstreamResponse = await callUpstreamSse(content, slug);

    // 设置响应头
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
    }

    const decoder = new TextDecoder();

    

    upstreamResponse.body.on("data", (chunk) => {
      try {
        const text = decoder.decode(chunk);
        safeWrite(text);
      } catch (error) {
        console.error("数据处理错误:", error);
        safeWrite('data: {"error": "数据处理错误"}\n\n');
      }
    });

    upstreamResponse.body.on("error", (err) => {
      console.error("流错误:", err);
      safeWrite('data: {"error": "流处理错误"}\n\n');
      safeEnd();
    });

    upstreamResponse.body.on("end", () => {
      safeEnd();
    });

    // 监听响应对象的 close 事件代替 req
    res.on("close", () => {
      console.log("客户端断开连接");
      isResponseEnded = true;
      onClientDisconnect(); // 调用回调函数
    });
  } catch (error) {
    console.error("Stream请求失败", error);
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
    }
    safeWrite('data: {"error": "内部服务器错误"}\n\n');
    safeEnd();
  }
}

export async function terminateMessageService(slug: string): Promise<boolean> {
  console.log("Service层调用terminateMessageService slug = ", slug);
  const result = terminateStream(slug);
  return result;
}

export interface MessageInfo {
  chatId: number;
  content: string;
  role: "user" | "assistant";
}

export async function GetMessages(slug) {
  console.log("Service层调用GetMessage slug = ", slug);
  return await getMessages(slug);
}
