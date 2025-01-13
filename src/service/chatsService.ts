import * as chatsDao from "../dao/chatsDao";
import { Chats } from "../pojo";

export async function createChats(account: string, title: string) {
  let createdTime = Date.now();
  let updatedTime = createdTime;
  let p = new Chats(account, title, createdTime, updatedTime);
  let res = await chatsDao.addChat(p);
  return res;
}

export async function updateChats(id: number, title: string): Promise<boolean> {
  let updatedTime = Date.now();
  let chat = new Chats("", title, 0, updatedTime, id);
  let res = await chatsDao.updateChatById(chat);
  return res;
}

export async function deleteChats(id: number): Promise<boolean> {
  let res = await chatsDao.deleteChatById(id);
  return res;
}

export async function getChatsByAccount(account: string): Promise<Chats[]> {
  let res = await chatsDao.getChatsByAccount(account);
  return res;
}
