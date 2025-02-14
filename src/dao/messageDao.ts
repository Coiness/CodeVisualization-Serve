import fetch, { Response as FetchResponse } from "node-fetch";
import { anythingLLM_API_KEY } from "../service/configs";

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

export async function callExternalStreamApi(
  streamRequest: StreamRequest,
  slug: string
): Promise<FetchResponse> {
  const AI_STREAM_URL = `http://localhost:3001/api/v1/workspace/80fe1b62-a5fc-47f0-97ec-574ec1aaba86/thread/${slug}/stream-chat`;

  return fetch(AI_STREAM_URL, {
    method: "POST",
    headers: {
      accept: "text/event-stream",
      "Content-Type": "application/json",
      Authorization: `Bearer ${anythingLLM_API_KEY} `,
    },
    body: JSON.stringify(streamRequest),
  });
}
