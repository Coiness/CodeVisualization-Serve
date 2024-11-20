// 关注的实体类
export class Follow {
  account: string; //发起关注操作者
  followAccount: string; //被关注者

  constructor(account: string, followAccount: string) {
    this.account = account;
    this.followAccount = followAccount;
  }
}
