import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from "discord.js";
import { CAREER_RANKS, GENERAL_RANKS } from "../config/ranks";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function cmdAyuda(message: any) {
  const prefix = "!";

  const embedMain = new EmbedBuilder()
    .setTitle("📌 GUS XP - Centro de Ayuda")
    .setDescription(
      "Selecciona una sección usando los botones.\n\n" +
        "**¿Qué hace este bot?**\n" +
        "Sistema de XP + Rangos militares + Vinculación con Roblox + Staff con aprobación Head-Admin."
    )
    .addFields(
      {
        name: "📌 Secciones",
        value:
          "• 📖 Comandos del Usuario\n" +
          "• ⭐ Rangos y XP\n" +
          "• 🛡️ Comandos Staff/Admin",
        inline: false
      },
      {
        name: "⚡ Importante",
        value:
          "Los Admins **no pueden** dar/quitar XP directamente.\n" +
          "Se crea una solicitud y un **Head-Admin** la aprueba con botones.",
        inline: false
      }
    )
    .setFooter({ text: "GUS XP • Usa los botones para navegar" });

  const embedUser = new EmbedBuilder()
    .setTitle("📖 Comandos de Usuario")
    .setDescription("Comandos disponibles para todos los usuarios.")
    .addFields(
      {
        name: "👤 Perfil",
        value:
          `• \`${prefix}perfil\` → Muestra tu perfil (XP, rango, clase, grupos Roblox)\n` +
          `• \`${prefix}setroblox <usuario>\` → Vincula tu Roblox al bot`,
        inline: false
      }
    )
    .setFooter({ text: "Sección: Usuario" });

  const embedRanks = new EmbedBuilder()
    .setTitle("⭐ Rangos y XP")
    .setDescription("Estructura oficial de rangos por XP.")
    .addFields(
      {
        name: "📌 Rangos por Carrera",
        value:
          chunk(
            CAREER_RANKS.map((r) => `• ${r.rank} (${r.minXp} XP+)`),
            12
          )
            .map((part) => part.join("\n"))
            .slice(0, 1)[0] || "No disponible.",
        inline: false
      },
      {
        name: "🎖️ Generales (No suben por XP)",
        value: GENERAL_RANKS.map((g: string) => `• ${g}`).join("\n"),
        inline: false
      }
    )
    .setFooter({ text: "Sección: Rangos" });

  const embedStaff = new EmbedBuilder()
    .setTitle("🛡️ Staff y Administración")
    .setDescription("Comandos restringidos por permisos.")
    .addFields(
      {
        name: "⭐ Head-Admins",
        value:
          `• \`${prefix}addadmin @user\` → Agrega un Admin\n` +
          `• \`${prefix}removeadmin @user\` → Remueve un Admin\n` +
          `• \`${prefix}addhead-admin @user\` → Agrega Head-Admin\n` +
          `• \`${prefix}removehead-admin @user\` → Remueve Head-Admin\n` +
          `• \`${prefix}stafflist\` → Lista Staff`,
        inline: false
      },
      {
        name: "🛡️ Admins",
        value:
          `• \`${prefix}addxp @user <cantidad> [motivo]\` → Solicita agregar XP (requiere aprobación)\n` +
          `• \`${prefix}removexp @user <cantidad> [motivo]\` → Solicita quitar XP (requiere aprobación)`,
        inline: false
      }
    )
    .setFooter({ text: "Sección: Staff" });

  const btnMain = new ButtonBuilder()
    .setCustomId("help_main")
    .setLabel("Inicio")
    .setStyle(ButtonStyle.Secondary);

  const btnUser = new ButtonBuilder()
    .setCustomId("help_user")
    .setLabel("Usuario")
    .setStyle(ButtonStyle.Primary);

  const btnRanks = new ButtonBuilder()
    .setCustomId("help_ranks")
    .setLabel("Rangos")
    .setStyle(ButtonStyle.Success);

  const btnStaff = new ButtonBuilder()
    .setCustomId("help_staff")
    .setLabel("Staff")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    btnMain,
    btnUser,
    btnRanks,
    btnStaff
  );

  const msg = await message.reply({
    embeds: [embedMain],
    components: [row]
  });

  const collector = msg.createMessageComponentCollector({
    time: 1000 * 60 * 5
  });

  collector.on("collect", async (i: any) => {
    if (i.user.id !== message.author.id) {
      await i.reply({ content: "❌ Solo el que ejecutó el comando puede usar estos botones.", ephemeral: true });
      return;
    }

    if (i.customId === "help_main") {
      await i.update({ embeds: [embedMain], components: [row] });
      return;
    }
    if (i.customId === "help_user") {
      await i.update({ embeds: [embedUser], components: [row] });
      return;
    }
    if (i.customId === "help_ranks") {
      await i.update({ embeds: [embedRanks], components: [row] });
      return;
    }
    if (i.customId === "help_staff") {
      await i.update({ embeds: [embedStaff], components: [row] });
      return;
    }
  });
}
