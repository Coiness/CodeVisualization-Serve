export class Video {
  id: number;
  name: string;
  account: string;
  content: string;
  createTime: number;
  permission: number;

  constructor(
    id: number,
    name: string,
    account: string,
    content: string,
    createTime: number,
    permission: number
  ) {
    this.id = id;
    this.name = name;
    this.account = account;
    this.content = content;
    this.createTime = createTime;
    this.permission = permission;
  }
}
