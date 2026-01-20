import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { settings } from "./config/settings";
import { handleMessage } from "./handlers/message.handler";
import { handleInteraction } from "./handlers/interaction.handler";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.on("ready", () => {
  console.log(`✅ Bot iniciado como ${client.user?.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    await handleMessage(client, message);
  } catch (err) {
    console.error(err);
    await message.reply("Ocurrió un error ejecutando el comando.");
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    await handleInteraction(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.isRepliable()) {
      await interaction.reply({ content: "Error procesando la interacción.", ephemeral: true });
    }
  }
});

client.login(settings.token);
