import fetch, { Response as FetchResponse } from "node-fetch";

export interface Attachment {
  name: string;
  mime: string;
  contentString: string;
}

export interface StreamRequest {
  message: string;
  mode: "query" | "chat";
  userId: number;
  attachments: Attachment[];
}

export async function callExternalStreamApi(
  streamRequest: StreamRequest,
  slug: string
): Promise<FetchResponse> {
  const AI_STREAM_URL = `http://localhost:3001/api/v1/workspace/dsv/thread/${slug}/stream-chat`;

  return fetch(AI_STREAM_URL, {
    method: "POST",
    headers: {
      accept: "text/event-stream",
      "Content-Type": "application/json",
      Authorization: `Bearer WQHE9HA-NCZMNBM-PN69BA8-PAWKFD3`,
    },
    body: JSON.stringify(streamRequest),
  });
}
