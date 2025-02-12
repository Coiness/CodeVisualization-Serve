import * as chatsDao from "../dao/chatsDao";
import { Chats } from "../pojo";
import { addChat } from "../dao/anythingLLM";
import e = require("express");

export async function getChatByAccount(account: string): Promise<Chats[]> {
  let res = await chatsDao.getChatsByAccount(account);
  return res;
}

export async function deleteChat(id: string): Promise<boolean> {
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

//Todo:接入LLM
export async function createChat(account: string) {
  console.log("调用createChat");
  let updatedTime = new Date().toISOString();
  let slug = account + updatedTime.toString();
  let res_llm = await addChat(account, slug);
  console.log(res_llm);
  if (res_llm) {
    let p = new Chats(account, "新对话", updatedTime, slug);
    let res = await chatsDao.addChat(p);
    console.log(`调用chatsDao.addChat()返回结果 ${res}`);
    if (res) {
      console.log(slug);
      return slug;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
