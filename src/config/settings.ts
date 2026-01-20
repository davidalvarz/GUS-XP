import "dotenv/config";

export const settings = {
  token: process.env.DISCORD_TOKEN ?? "",
  prefix: process.env.PREFIX ?? "!",
  headAdminId: process.env.HEAD_ADMIN_ID ?? "",
  approvalChannelId: process.env.APPROVAL_CHANNEL_ID ?? ""
};

if (!settings.token) {
  throw new Error("Falta DISCORD_TOKEN en .env");
}
if (!settings.headAdminId) {
  throw new Error("Falta HEAD_ADMIN_ID en .env");
}

/**
 * Whitelist de admins autorizados a solicitar XP.
 * Puedes agregar IDs aquí.
 */
export const ADMIN_WHITELIST: string[] = [
  // "123456789012345678",
];
