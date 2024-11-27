import * as nodemailer from "nodemailer";
import { config as config } from "./configs";

export async function sendEmail(email: string, code: string): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // 第三方邮箱的主机地址
    // port: 465,
    port: 465, // 第三方邮箱的端口
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.mail, // 发送方邮箱的账号
      pass: config.pass, // 邮箱授权密码
    },
  });

  try {
    // 定义transport对象并发送邮件
    console.log("send email");
    await transporter.sendMail({
      from: `"发自我的电脑" <${config.mail}>`, // 发送方邮箱的账号
      to: email, // 邮箱接受者的账号
      subject: "你们好啊，我是Coiness", // Subject line
      text: "", // 文本内容
      html: `验证码为：${code}`, // html 内容, 如果设置了html内容, 将忽略text内容
    });
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}
