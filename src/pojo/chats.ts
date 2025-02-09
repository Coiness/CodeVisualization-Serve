export class Chats {
  id?: string;
  account: string;
  title: string;
  updatedTime: number;

  constructor(
    account: string,
    title: string,
    updatedTime: number,
    id?: string
  ) {
    this.id = id;
    this.account = account;
    this.title = title;
    this.updatedTime = updatedTime;
  }
}
