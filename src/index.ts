import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";

import { settings } from "./config/settings";
import { handleMessage } from "./handlers/message.handler";
import { handleInteraction } from "./handlers/interaction.handler";

// ✅ Anti-crash global (Railway / producción)
process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
});

// ✅ Cliente Discord con intents necesarios
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // necesario para estar en servidores
    GatewayIntentBits.GuildMessages, // necesario para leer mensajes
    GatewayIntentBits.MessageContent // necesario para comandos con prefijo (!perfil)
  ],
  partials: [Partials.Channel] // recomendado para evitar errores en ciertos eventos
});

// ✅ Evento Ready
client.once("ready", () => {
  console.log("✅ Bot conectado correctamente.");
  console.log(`🤖 Sesión iniciada como: ${client.user?.tag}`);
  console.log(`📌 Prefix configurado: ${settings.prefix}`);
});

// ✅ Captura de mensajes (comandos)
client.on("messageCreate", async (message) => {
  try {
    await handleMessage(client, message);
  } catch (error) {
    console.error("❌ Error en messageCreate handler:", error);
  }
});

// ✅ Captura de interacciones (botones de aprobación)
client.on("interactionCreate", async (interaction) => {
  try {
    await handleInteraction(interaction);
  } catch (error) {
    console.error("❌ Error en interactionCreate handler:", error);
  }
});

// ✅ Login
(async () => {
  try {
    console.log("🚀 Iniciando bot...");
    await client.login(settings.discordToken);
  } catch (error) {
    console.error("❌ Error al iniciar sesión con Discord:", error);
    process.exit(1);
  }
})();

// ✅ Apagado seguro (Railway)
async function shutdown(signal: string) {
  try {
    console.log(`🛑 Recibido ${signal}. Cerrando bot...`);
    await client.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
