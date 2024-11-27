import { createCode, checkCode } from "@ycx60rzvvbj1523/unique-code";
import { invitationCodeConfig } from "./configs";

const UniqueCodeKey = invitationCodeConfig.key;

export function createInvitationCode(): string {
  return createCode(UniqueCodeKey);
}

export function checkInvitationCode(code: string): boolean {
  console.log(UniqueCodeKey);
  return true;
}
