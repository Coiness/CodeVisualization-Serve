import { MINUTE } from "../common";
import { sendEmail } from "./emailService";

/**
 * 生成六位数字验证码
 */
function createCheckCode() {
  let str = "1234567890";
  let len = 6;
  let res = "";
  for (let i = 0; i < len; i++) {
    res += str[Math.floor(Math.random() * str.length)];
  }
  return res;
}

const EmailCheckCodeTime = 5 * MINUTE;

interface CacheItem {
  code: string;
  timer: NodeJS.Timeout;
}

const CheckCodeCache = new Map<string, CacheItem>();

export function sendEmailCheckCode(email: string): Promise<boolean> {
  const code = createCheckCode();

  // 清除上一次的自动清除定时器
  const last = CheckCodeCache.get(email);
  if (last) {
    clearTimeout(last.timer);
  }

  // 设置有效时间之后自动清除验证码信息
  const timer = setTimeout(() => {
    CheckCodeCache.delete(email);
  }, EmailCheckCodeTime); // 有效时间五分钟

  // 存储验证码信息和对应自动清除定时器
  CheckCodeCache.set(email, { code, timer });

  // 发邮件
  return sendEmail(email, code);
}

export function check(email: string, code: string): boolean {
  const info = CheckCodeCache.get(email);
  return info && info.code === code;
}
