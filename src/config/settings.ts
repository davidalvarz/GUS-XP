import dotenv from "dotenv";

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
  databaseUrl: requireEnv("DATABASE_URL"),
  prefix: process.env.PREFIX?.trim() || "!",
  approvalChannelId: process.env.APPROVAL_CHANNEL_ID?.trim() || "",
  ownerId: process.env.OWNER_ID?.trim() || ""
};
