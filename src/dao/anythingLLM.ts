// request.ts

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { anythingLLM_API_KEY } from "../service/configs";
import { response } from "express";

const instance = axios.create({
  baseURL:
    "http://localhost:3001/api/v1/workspace/c405523d-4450-4155-9fd2-1ad7d104c4f0/thread", // 替换为你的后端地址
  timeout: 5000,
});

// GET 请求
export async function getRequest<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  console.log("URL:", url);
  console.log("Config:", config);
  const response: AxiosResponse<T> = await instance.get(url, config);
  console.log("Response type:", typeof response);
  console.log("Response.data type:", typeof response.data);
  return response.data;
}

// POST 请求
export async function postRequest<T = any>(
  url: string,
  config?: AxiosRequestConfig,
  data?: any
): Promise<T> {
  const response: AxiosResponse<T> = await instance.post(url, data, config);
  return response.data;
}

// 封装 DELETE 请求
export async function deleteRequest<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await instance.delete(url, config);
  return response.data;
}

export async function addChat(account: string, id: string) {
  const response = await postRequest(
    "/new",
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${anythingLLM_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
    {
      userId: account,
      name: "chat" + id,
      slug: id,
    }
  );
  return response;
}

export async function delChat(id: string) {
  const response = await postRequest(`/${id}`, {
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${anythingLLM_API_KEY}`,
    },
  });
}

export interface MessageInfo {
  chatId: number;
  content: string;
  role: "user" | "assistant";
}

export async function getMessages(slug: string): Promise<MessageInfo[]> {
  console.log("Dao层调用GetMessage slug = ", slug);
  let response;
  try {
    response = await getRequest(`/${slug}/chats`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${anythingLLM_API_KEY}`,
      },
    });
  } catch (error) {
    console.log("Dao层调用出错", error.message || error);
    throw new Error("获取消息失败");
  }
  console.log("GetMessage的ServerResponse", response);
  if (!Array.isArray(response.history)) {
    throw new Error("返回数据不是数组");
  }

  const messages: MessageInfo[] = response.history.map((item) => {
    return {
      chatId: item.chatId,
      content: item.content,
      role: item.role,
    };
  });
  return messages;
}
