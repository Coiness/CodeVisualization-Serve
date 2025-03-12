import { sign } from "crypto";
import { anythingLLM_API_KEY ,workspaceID} from "../service/configs";
import fetch, { Response as FetchResponse } from "node-fetch";

// 创建会话控制映射表
const activeStreams = new Map<string, AbortController>();

export async function callUpstreamSse(
  content: string,
  slug: string,
  existingSignal?: AbortSignal
): Promise<FetchResponse> {
  // 为每个会话创建一个新的 AbortController
  let controller: AbortController;
  let signal: AbortSignal;

  if (existingSignal) {
    signal = existingSignal;
  } else {
    //如果已经存在此会话的AbortController，先移除旧的
    if (activeStreams.has(slug)) {
      activeStreams.get(slug)?.abort();
    }

    controller = new AbortController();
    activeStreams.set(slug, controller);
    signal = controller.signal;
  }

  console.log("callUpstreamSse");
  const url = `http://localhost:3001/api/v1/workspace/${workspaceID}/thread/${slug}/stream-chat`;
  try {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "text/event-stream",
        Authorization: `Bearer ${anythingLLM_API_KEY}`,
      },
      body: JSON.stringify({
        message: `${content}`,
        mode: "chat",
        userId: 1,
        attachments: [{}],
      }),
      signal: signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      console.log(`会话${slug}已经被关闭`);
    }

    if (!existingSignal) {
      activeStreams.delete(slug);
    }

    throw error;
  }
}

/*
 * 终止会话
 * @param slug 会话标识
 * @return 是否成功终止
 */

export function terminateStream(slug: string): boolean {
  const controller = activeStreams.get(slug);

  if (controller) {
    controller.abort();
    activeStreams.delete(slug);
    return true;
  }

  return false;
}

/**
 * 获取所有活跃会话
 */
export function getActiveStreams(): string[] {
  return Array.from(activeStreams.keys());
}
