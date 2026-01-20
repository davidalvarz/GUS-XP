import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { settings } from "./config/settings";
import { handleMessage } from "./handlers/message.handler";
import { handleInteraction } from "./handlers/interaction.handler";
import { seedFirstHeadAdmin } from "./services/staff.service";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", async () => {
  console.log("✅ Bot conectado correctamente.");
  console.log(`🤖 Sesión iniciada como: ${client.user?.tag}`);
  console.log(`📌 Prefix configurado: ${settings.prefix}`);

  // ✅ Rich Presence: "Jugando a Utiliza !ayuda"
  client.user?.setPresence({
    activities: [
      {
        name: `Utiliza ${settings.prefix}ayuda`,
        type: ActivityType.Playing
      }
    ],
    status: "online"
  });

  // ✅ Seed del OWNER como Head-Admin si no existe ninguno
  await seedFirstHeadAdmin();
});

client.on("messageCreate", async (message) => {
  await handleMessage(client, message);
});

client.on("interactionCreate", async (interaction) => {
  await handleInteraction(interaction);
});

client.login(settings.discordToken).catch((err) => {
  console.error("❌ Error al iniciar sesión con Discord:", err);
});
