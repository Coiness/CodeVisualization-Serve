// 算法的实体类
export class Algorithm {
  id: number;
  name: string;
  account: string;
  content: string;
  createTime: number;
  modifyTime: number;
  permission: number;
  description: string;

  //构造函数
  constructor(
    id: number,
    name: string,
    account: string,
    content: string,
    createTime: number,
    modifyTime: number,
    permission: number,
    description: string
  ) {
    this.id = id;
    this.name = name;
    this.account = account;
    this.content = content;
    this.createTime = createTime;
    this.modifyTime = modifyTime;
    this.permission = permission;
    this.description = description;
  }
}
