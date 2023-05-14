import * as nodemailer from "nodemailer";
import { emailConfig as config } from "./configs";

export async function sendEmail(email: string, code: string): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    host: "smtp.126.com", // 第三方邮箱的主机地址
    // port: 465,
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.mail, // 发送方邮箱的账号
      pass: config.pass, // 邮箱授权密码
    },
  });

  try {
    // 定义transport对象并发送邮件
    await transporter.sendMail({
      from: `"D&A Visualization" <${config.mail}>`, // 发送方邮箱的账号
      to: email, // 邮箱接受者的账号
      subject: "欢迎注册 D&A Visualization", // Subject line
      text: "", // 文本内容
      html: `验证码为：${code}`, // html 内容, 如果设置了html内容, 将忽略text内容
    });
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}
