export class Project {
  id: number;
  name: string;
  account: string;
  snapshot: string;
  createTime: number;
  modifyTime: number;
  permission: number;

  constructor(
    id: number,
    name: string,
    account: string,
    snapshot: string,
    createTime: number,
    modifyTime: number,
    permission: number
  ) {
    this.id = id;
    this.name = name;
    this.account = account;
    this.snapshot = snapshot;
    this.createTime = createTime;
    this.modifyTime = modifyTime;
    this.permission = permission;
  }
}
