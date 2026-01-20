import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from "discord.js";
import { CAREER_RANKS, GENERAL_RANKS } from "../config/ranks";
import { settings } from "../config/settings";

export async function cmdAyuda(message: any) {
  const prefix = settings.prefix;

  // Ordenar rangos por XP
  const sortedRanks = [...CAREER_RANKS].sort((a, b) => a.minXp - b.minXp);

  const tropas = sortedRanks.filter((r) => r.className === "Tropas");
  const suboficiales = sortedRanks.filter((r) => r.className === "Suboficiales");
  const oficiales = sortedRanks.filter((r) => r.className === "Oficiales");
  const oficialesMayores = sortedRanks.filter((r) => r.className === "Oficiales mayores");

  const formatRanks = (arr: any[]) =>
    arr.map((r) => `• **${r.rankName}** → **${r.minXp} XP**`).join("\n");

  const pages: EmbedBuilder[] = [
    // ✅ Página 1: General
    new EmbedBuilder()
      .setTitle("📌 Ayuda - Sistema de XP (Información General)")
      .setDescription(
        `Este bot maneja un **sistema de experiencia (XP)** que define automáticamente tu **clase y rango**.\n\n` +
          `✅ El XP es **acumulativo** (se suma en tu perfil).\n` +
          `✅ Al alcanzar un objetivo, subes automáticamente al siguiente rango.\n` +
          `✅ Verás tu progreso con \`${prefix}perfil\`.\n\n` +
          `📌 Usa los botones para navegar por la ayuda.`
      )
      .addFields(
        {
          name: "🎯 Objetivo del sistema",
          value:
            `Ganar XP para progresar por las clases:\n` +
            `• Tropas\n• Suboficiales\n• Oficiales\n• Oficiales mayores\n\n` +
            `⭐ Los **Generales** aparecen en el perfil pero **NO reciben XP ni suben por XP**.`,
          inline: false
        }
      )
      .setFooter({ text: "Página 1/6 — General" }),

    // ✅ Página 2: Usuario
    new EmbedBuilder()
      .setTitle("👤 Ayuda - Comandos de Usuario")
      .setDescription(
        `Estos comandos los puede usar cualquier usuario del servidor.\n\n` +
          `📌 Consejo: Vincula tu Roblox para que tu perfil muestre avatar y nombre.`
      )
      .addFields(
        {
          name: "📄 Perfil",
          value:
            `• \`${prefix}perfil\` → Muestra tu perfil completo (XP, rango, progreso)\n` +
            `• \`${prefix}perfil @usuario\` → Ver el perfil de otra persona`,
          inline: false
        },
        {
          name: "🔗 Vincular Roblox",
          value:
            `• \`${prefix}setroblox <username|id>\` → Vincula tu cuenta Roblox\n\n` +
            `Ejemplos:\n` +
            `• \`${prefix}setroblox SrKillerPlay\`\n` +
            `• \`${prefix}setroblox 123456789\``,
          inline: false
        },
        {
          name: "📌 Menú de ayuda",
          value: `• \`${prefix}ayuda\` → Muestra este panel con botones`,
          inline: false
        }
      )
      .setFooter({ text: "Página 2/6 — Usuario" }),

    // ✅ Página 3: Staff (roles)
    new EmbedBuilder()
      .setTitle("🧩 Ayuda - Sistema de Staff (Permisos)")
      .setDescription(
        `El sistema de permisos está dividido en 2 niveles:\n\n` +
          `🛡️ **ADMIN**\n` +
          `• Puede **SOLICITAR** agregar o quitar XP\n` +
          `• Pero requiere aprobación de Head-Admin\n\n` +
          `⭐ **HEAD-ADMIN**\n` +
          `• Puede **APROBAR/RECHAZAR** solicitudes de XP\n` +
          `• Puede **gestionar Admins y Head-Admins**`
      )
      .addFields(
        {
          name: "🔔 Aprobaciones (muy importante)",
          value:
            `Cuando un Admin solicita XP, el bot manda un mensaje de aprobación y hace **ping a TODOS los Head-Admins**.\n` +
            `Cualquiera de los Head-Admins puede aprobar con botones ✅/❌.`,
          inline: false
        }
      )
      .setFooter({ text: "Página 3/6 — Staff" }),

    // ✅ Página 4: Admin XP commands
    new EmbedBuilder()
      .setTitle("🛡️ Ayuda - Comandos ADMIN (XP)")
      .setDescription(
        `Estos comandos solo los puede usar un usuario con rol **ADMIN** o **HEAD-ADMIN**.\n\n` +
          `⚠️ Importante: NO aplican cambios directos.\n` +
          `✅ Se envía una solicitud para aprobación con botones.`
      )
      .addFields(
        {
          name: "➕ Solicitar agregar XP",
          value:
            `• \`${prefix}addxp @usuario <cantidad> [razón]\`\n\n` +
            `Ejemplo:\n` +
            `• \`${prefix}addxp @Juan 50 Buen desempeño\``,
          inline: false
        },
        {
          name: "➖ Solicitar quitar XP",
          value:
            `• \`${prefix}removexp @usuario <cantidad> [razón]\`\n\n` +
            `Ejemplo:\n` +
            `• \`${prefix}removexp @Juan 25 Inactividad\``,
          inline: false
        },
        {
          name: "📌 Nota",
          value:
            `Si el usuario es **General**, cualquier modificación de XP será rechazada automáticamente.`,
          inline: false
        }
      )
      .setFooter({ text: "Página 4/6 — Admin XP" }),

    // ✅ Página 5: Head-admin management commands
    new EmbedBuilder()
      .setTitle("⭐ Ayuda - Comandos HEAD-ADMIN (Gestión de Staff)")
      .setDescription(
        `Estos comandos solo los puede usar un usuario con rol **HEAD-ADMIN**.\n\n` +
          `Sirven para administrar quién puede usar comandos de XP y quién puede aprobarlos.`
      )
      .addFields(
        {
          name: "👮 Administrar Admins",
          value:
            `• \`${prefix}addadmin @usuario\` → Agrega un ADMIN\n` +
            `• \`${prefix}removeadmin @usuario\` → Quita un ADMIN`,
          inline: false
        },
        {
          name: "👑 Administrar Head-Admins",
          value:
            `• \`${prefix}addhead-admin @usuario\` → Agrega un HEAD-ADMIN\n` +
            `• \`${prefix}removehead-admin @usuario\` → Quita un HEAD-ADMIN\n\n` +
            `⚠️ Seguridad: no se permite eliminar al **último** Head-Admin.`,
          inline: false
        }
      )
      .setFooter({ text: "Página 5/6 — Head-Admin" }),

    // ✅ Página 6: Ranks + Generals
    new EmbedBuilder()
      .setTitle("🎖️ Ayuda - Rangos, Objetivos XP y Generales")
      .setDescription(
        `Cada rango se desbloquea al alcanzar el XP mínimo indicado.\n\n` +
          `📌 Cuando llegas al XP objetivo, avanzas automáticamente al siguiente rango.\n` +
          `⭐ Los **Generales** aparecen en el perfil pero **NO reciben XP**.`
      )
      .addFields(
        {
          name: "🪖 Tropas",
          value: formatRanks(tropas),
          inline: false
        },
        {
          name: "🎗️ Suboficiales",
          value: formatRanks(suboficiales),
          inline: false
        },
        {
          name: "🎖️ Oficiales",
          value: formatRanks(oficiales),
          inline: false
        },
        {
          name: "🏅 Oficiales Mayores",
          value: formatRanks(oficialesMayores),
          inline: false
        },
        {
          name: "⭐ Generales (Clase bloqueada por XP)",
          value:
            `• \`${prefix}setgeneral @usuario <rango>\` → Asigna General y bloquea XP\n\n` +
            `Rangos disponibles:\n` +
            GENERAL_RANKS.map((g) => `• **${g}**`).join("\n"),
          inline: false
        }
      )
      .setFooter({ text: "Página 6/6 — Rangos y Generales" })
  ];

  let index = 0;

  const makeRow = (disabled = false) => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("help_prev")
        .setLabel("⬅️ Atrás")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled || index === 0),

      new ButtonBuilder()
        .setCustomId("help_next")
        .setLabel("Siguiente ➡️")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled || index === pages.length - 1),

      new ButtonBuilder()
        .setCustomId("help_close")
        .setLabel("Cerrar")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(disabled)
    );
  };

  const sent = await message.reply({
    embeds: [pages[index]],
    components: [makeRow(false)]
  });

  const collector = sent.createMessageComponentCollector({
    time: 120000 // 2 min
  });

  collector.on("collect", async (interaction: any) => {
    try {
      if (interaction.user.id !== message.author.id) {
        await interaction.reply({
          content: "Solo la persona que ejecutó `!ayuda` puede usar estos botones.",
          ephemeral: true
        });
        return;
      }

      if (interaction.customId === "help_prev") {
        index = Math.max(0, index - 1);
        await interaction.update({
          embeds: [pages[index]],
          components: [makeRow(false)]
        });
        return;
      }

      if (interaction.customId === "help_next") {
        index = Math.min(pages.length - 1, index + 1);
        await interaction.update({
          embeds: [pages[index]],
          components: [makeRow(false)]
        });
        return;
      }

      if (interaction.customId === "help_close") {
        collector.stop("closed");
        await interaction.update({
          content: "✅ Ayuda cerrada.",
          embeds: [],
          components: []
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }
  });

  collector.on("end", async () => {
    try {
      await sent.edit({
        components: [makeRow(true)]
      });
    } catch {
      // ignore
    }
  });
}
