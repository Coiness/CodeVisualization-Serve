// messageService.ts

import { Message } from "../pojo/message";
import * as messageDao from "../dao/messageDao";

/**
 * 添加新的消息记录
 * @param chatID 聊天的唯一标识
 * @param role 消息角色（如用户或机器人）
 * @param content 消息内容
 * @returns 插入是否成功
 */
export async function addMessage(
  chatID: number,
  role: string,
  content: string
): Promise<boolean> {
  let createdTime = Date.now();
  let message = new Message(chatID, role, content, createdTime);
  let res = await messageDao.addMessage(message);
  return res;
}

/**
 * 根据聊天ID获取消息记录
 * @param chatID 聊天的唯一标识
 * @param pagination 分页参数（limit 和 offset）
 * @returns 消息对象数组
 */
export async function getMessagesByChatId(
  chatID: number,
  pagination: { limit: number; offset: number }
): Promise<Message[]> {
  let res = await messageDao.getMessageByChatId(chatID, pagination);
  return res;
}

/**
 * 根据聊天ID删除所有相关的消息记录
 * @param chatID 聊天的唯一标识
 * @returns 删除是否成功
 */
export async function deleteMessages(chatID: number): Promise<boolean> {
  let res = await messageDao.deleteMessagesByChatId(chatID);
  return res;
}
