// request.ts

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api/v1/workspace/dsv/thread", // 替换为你的后端地址
  timeout: 5000,
});

// GET 请求
export async function getRequest<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await instance.get(url, config);
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

async function addChat(account: string) {
  const id = account + Date.now();
  const response = await postRequest(
    "/new",
    {
      headers: {
        accept: "application/json",
        Authorization: "Bearer WQHE9HA-NCZMNBM-PN69BA8-PAWKFD3",
        "Content-Type": "application/json",
      },
    },
    {
      userId: account,
      name: "chat" + id,
      slug: id,
    }
  );
}

async function deleteChat(id: string) {
  const response = await postRequest(`/${id}`, {
    headers: {
      accept: "*/*",
      Authorization: "Bearer WQHE9HA-NCZMNBM-PN69BA8-PAWKFD3",
    },
  });
}

async function getMessages(id: string) {
  const response = await getRequest(`/${id}/chats`, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer WQHE9HA-NCZMNBM-PN69BA8-PAWKFD3",
    },
  });
}
