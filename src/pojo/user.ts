export class User {
  account: string;
  pwd: string;
  name: string;
  img: string;
  token: string;
  invitationCode: string;

  constructor(account, pwd, name, img, token, invitationCode) {
    this.account = account;
    this.pwd = pwd;
    this.name = name;
    this.img = img;
    this.token = token;
    this.invitationCode = invitationCode;
  }
}
