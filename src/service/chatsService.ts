import * as chatsDao from "../dao/chatsDao";
import { Chats } from "../pojo";

//Todo:接入LLM
export async function createChats(account: string, title: string) {
  let createdTime = Date.now();
  let updatedTime = createdTime;
  let p = new Chats(account, title, createdTime);
  let res = await chatsDao.addChat(p);
  return res;
}

export async function updateChats(id: string, title: string): Promise<boolean> {
  let updatedTime = Date.now();
  let chat = new Chats("", title, updatedTime, id);
  let res = await chatsDao.updateChatById(chat);
  return res;
}

export async function deleteChats(id: string): Promise<boolean> {
  let res = await chatsDao.deleteChatById(id);
  return res;
}

export async function getChatsByAccount(account: string): Promise<Chats[]> {
  let res = await chatsDao.getChatsByAccount(account);
  return res;
}
