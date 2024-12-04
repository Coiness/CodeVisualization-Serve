// 演示的实体类
export class Project {
  id: number;
  name: string;
  account: string;
  snapshot: string;
  createTime: number;
  modifyTime: number;
  permission: number;
  description: string;

  constructor(
    id: number,
    name: string,
    account: string,
    snapshot: string,
    createTime: number,
    modifyTime: number,
    permission: number,
    description: string
  ) {
    this.id = id;
    this.name = name;
    this.account = account;
    this.snapshot = snapshot;
    this.createTime = createTime;
    this.modifyTime = modifyTime;
    this.permission = permission;
    this.description = description;
  }
}
