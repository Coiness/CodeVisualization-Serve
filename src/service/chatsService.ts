import * as chatsDao from "../dao/chatsDao";
import { Chats } from "../pojo";
import { addChat, delChat } from "../dao/anythingLLM";
import e = require("express");

export async function getChatByAccount(account: string): Promise<Chats[]> {
  let res = await chatsDao.getChatsByAccount(account);
  return res;
}

export async function deleteChat(id: string): Promise<boolean> {
  let res_llm = await delChat(id);
  let res = await chatsDao.deleteChatById(id);
  return res;
}

export async function updateChat(
  account: string,
  id: string,
  title: string
): Promise<boolean> {
  console.log("调用updateChat(Service层)");
  let updatedTime = new Date().toISOString();
  let chat = new Chats(account, title, updatedTime, id);
  console.log("chat", chat);
  let res = await chatsDao.updateChatById(chat);
  return res;
}

export async function updateChat2(
  account: string,
  id: string,
): Promise<boolean> {
  console.log("调用updateChat(Service层)");
  let updatedTime = new Date().toISOString();
  let res = await chatsDao.updateChatById2(id, updatedTime);
  return res;
}

export async function createChat(account: string) {
  console.log("调用createChat");
  let updatedTime = new Date().toISOString();
  let slug = account + updatedTime;
  let res_llm = await addChat(account, slug);
  slug = res_llm.thread.slug;
  if (res_llm) {
    let p = new Chats(account, "新对话", updatedTime, slug);
    let res = await chatsDao.addChat(p);
    if (res) {
      return slug;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
