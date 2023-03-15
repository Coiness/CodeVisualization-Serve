export class Algorithm {
  id: number;
  name: string;
  account: string;
  content: string;
  createTime: number;
  modifyTime: number;
  permission: number;
  descrition: string;

  constructor(
    id: number,
    name: string,
    account: string,
    content: string,
    createTime: number,
    modifyTime: number,
    permission: number,
    descrition: string
  ) {
    this.id = id;
    this.name = name;
    this.account = account;
    this.content = content;
    this.createTime = createTime;
    this.modifyTime = modifyTime;
    this.permission = permission;
    this.descrition = descrition;
  }
}
