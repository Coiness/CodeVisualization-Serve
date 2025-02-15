export async function callUpstreamSse() {
  const url =
    "http://localhost:3001/api/v1/workspace/c405523d-4450-4155-9fd2-1ad7d104c4f0/thread/atest0214/stream-chat";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "text/event-stream",
      Authorization: "Bearer WQHE9HA-NCZMNBM-PN69BA8-PAWKFD3",
    },
    body: JSON.stringify({
      message: "你是谁",
      mode: "chat",
      userId: 1,
      attachments: [{}],
    }),
  });

  if (!response.ok || !response.body) {
    console.log("请求失败");
    return;
  }

  console.log("开始读取流式数据");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // 保留最后一个可能不完整的行
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data:")) continue;
        try {
          const jsonStr = line.slice(5);
          const data = JSON.parse(jsonStr);
          console.log("收到流式数据:", data);
        } catch (err) {
          console.error("JSON解析失败:", err);
        }
      }
    }
  } catch (error) {
    console.error("读取流失败:", error);
  } finally {
    reader.releaseLock(); // 释放锁定的资源
  }
}

callUpstreamSse().catch(console.error);
