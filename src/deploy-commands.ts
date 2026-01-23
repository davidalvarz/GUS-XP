import "dotenv/config";
import { REST, Routes } from "discord.js";

import { cmdSlashAyuda } from "./slash/commands/ayuda";
import { cmdSlashSetRoblox } from "./slash/commands/setroblox";
import { cmdSlashPerfil } from "./slash/commands/perfil";

const commands = [
  cmdSlashAyuda.data.toJSON(),
  cmdSlashSetRoblox.data.toJSON(),
  cmdSlashPerfil.data.toJSON()
];

async function main() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;

  if (!token || !clientId) {
    throw new Error("Faltan variables: DISCORD_TOKEN y/o CLIENT_ID");
  }

  const rest = new REST({ version: "10" }).setToken(token);

  console.log("🔄 Registrando comandos SLASH globales...");
  await rest.put(Routes.applicationCommands(clientId), { body: commands });

  console.log("✅ Slash commands registrados correctamente.");
}

main().catch((e) => {
  console.error("❌ Error registrando comandos:", e);
  process.exit(1);
});
