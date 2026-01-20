import dotenv from "dotenv";

// ✅ En local carga .env, en Railway se usan Variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value.trim();
}

export const settings = {
  discordToken: requireEnv("DISCORD_TOKEN"),
  prefix: process.env.PREFIX?.trim() || "!",
  approvalChannelId: process.env.APPROVAL_CHANNEL_ID?.trim() || ""
};
