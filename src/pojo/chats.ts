export class Chats {
  id?: string;
  account: string;
  title: string;
  updatedTime: string;

  constructor(
    account: string,
    title: string,
    updatedTime: string,
    id?: string
  ) {
    this.id = id;
    this.account = account;
    this.title = title;
    this.updatedTime = updatedTime;
  }
}
