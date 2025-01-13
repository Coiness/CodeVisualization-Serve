export class Message {
  id?: number;
  chatID: number;
  role: string; // 'system' | 'user' | 'ai'
  content: string;
  createdTime: number;

  constructor(
    chatID: number,
    role: string,
    content: string,
    createdTime: number,
    id?: number
  ) {
    this.id = id;
    this.chatID = chatID;
    this.role = role;
    this.content = content;
    this.createdTime = createdTime;
  }
}
