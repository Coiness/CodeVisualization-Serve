export class Chats {
  id?: number;
  account: string;
  title: string;
  createdTime: number;
  updatedTime: number;

  constructor(
    account: string,
    title: string,
    createdTime: number,
    updatedTime: number,
    id?: number
  ) {
    this.id = id;
    this.account = account;
    this.title = title;
    this.createdTime = createdTime;
    this.updatedTime = updatedTime;
  }
}
