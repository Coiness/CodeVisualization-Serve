// 录像的实体类
export class Video {
  id: number;
  name: string;
  account: string;
  content: string;
  createTime: number;
  permission: number;
  descrition: string;

  constructor(
    id: number,
    name: string,
    account: string,
    content: string,
    createTime: number,
    permission: number,
    descrition: string
  ) {
    this.id = id;
    this.name = name;
    this.account = account;
    this.content = content;
    this.createTime = createTime;
    this.permission = permission;
    this.descrition = descrition;
  }
}
