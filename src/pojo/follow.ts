export class Follow {
  account: string;
  followAccount: string;

  constructor(account: string, followAccount: string) {
    this.account = account;
    this.followAccount = followAccount;
  }
}
