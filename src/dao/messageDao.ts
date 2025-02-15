import { anythingLLM_API_KEY } from "../service/configs";
import fetch, { Response as FetchResponse } from "node-fetch";

export async function callUpstreamSse(
  content: string,
  slug: string
): Promise<FetchResponse> {
  const url = `http://localhost:3001/api/v1/workspace/c405523d-4450-4155-9fd2-1ad7d104c4f0/thread/${slug}/stream-chat`;
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
  });
}
