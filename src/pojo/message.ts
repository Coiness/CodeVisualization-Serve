export class Message {
  chatID: number;
  role: string; // 'system' | 'user' | 'ai'
  content: string;

  constructor(chatID: number, role: string, content: string) {
    this.chatID = chatID;
    this.role = role;
    this.content = content;
  }
}
