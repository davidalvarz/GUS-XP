import { ADMIN_WHITELIST } from "../config/settings";

export function isWhitelistedAdmin(userId: string, headAdminId: string) {
  if (userId === headAdminId) return true;
  return ADMIN_WHITELIST.includes(userId);
}
