import { Response } from "express";
import { callExternalStreamApi } from "../dao";
import { getMessages } from "../dao/anythingLLM";

export interface Attachment {
  name: string;
  mime: string;
  contentString: string;
}

export interface StreamRequest {
  message: string;
  mode: "chat";
  userId: number;
  attachments: Attachment[];
}

export async function handleStreamMessage(
  content: StreamRequest,
  slug: string,
  res: Response
) {
  // 调用 DAO 层调用下游服务，获取流式响应
  const externalResponse = await callExternalStreamApi(content, slug);
  if (!externalResponse.body) {
    res.end();
    return;
  }

  // externalResponse.body 是 Node.js 的 ReadableStream
  externalResponse.body.on("data", (chunk: Buffer) => {
    const text = chunk.toString(); // 将 Buffer 转换为字符串
    // 写入前端数据，格式与前端解析逻辑保持一致
    res.write(`data: ${text}\n\n`);
  });

  externalResponse.body.on("end", () => {
    res.end();
  });

  externalResponse.body.on("error", (err: any) => {
    console.error("Stream error:", err);
    res.end();
  });
}

export interface MessageInfo {
  chatId: number;
  content: string;
  role: "user" | "assistant";
}

export async function GetMessages(slug) {
  return await getMessages(slug);
}
