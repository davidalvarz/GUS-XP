import "dotenv/config";
import express from "express";
import { Client, GatewayIntentBits, ActivityType } from "discord.js";

import { settings } from "./config/settings";
import { handleMessage } from "./handlers/message.handler";
import { handleInteraction } from "./handlers/interaction.handler";

import { seedFirstHeadAdmin } from "./services/staff.service";
import { idCardRouter } from "./api/idcard.api";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// ======================
// ✅ API Express (ID CARD)
// ======================
const app = express();

app.use("/api", idCardRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.get("/", (_, res) => {
  res.status(200).send("✅ GUS XP BOT API ONLINE");
});

app.listen(PORT, () => {
  console.log(`✅ API activa en puerto ${PORT}`);
});

// ======================
// ✅ BOT READY
// ======================
client.once("ready", async () => {
  console.log("✅ Bot conectado correctamente.");
  console.log(`🤖 Sesión iniciada como: ${client.user?.tag}`);
  console.log(`📌 Prefix configurado: ${settings.prefix}`);

  // ✅ Rich Presence
  client.user?.setPresence({
    activities: [
      {
        name: `Utiliza ${settings.prefix}ayuda`,
        type: ActivityType.Playing
      }
    ],
    status: "online"
  });

  // ✅ Seed del OWNER como Head-Admin supremo
  await seedFirstHeadAdmin();
});

// ======================
// ✅ Prefijo (!)
// ======================
client.on("messageCreate", async (message) => {
  await handleMessage(client, message);
});

// ======================
// ✅ Interactions (Slash + Botones)
// ======================
client.on("interactionCreate", async (interaction) => {
  await handleInteraction(interaction);
});

// ======================
// ✅ Login
// ======================
client
  .login(settings.discordToken)
  .then(() => console.log("✅ Login exitoso."))
  .catch((err) => console.error("❌ Error al iniciar sesión con Discord:", err));
