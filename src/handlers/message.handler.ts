import { settings } from "../config/settings";

// ✅ Comandos usuario
import { cmdAyuda } from "../commands/ayuda";
import { cmdPerfil } from "../commands/perfil";
import { cmdSetRoblox } from "../commands/setroblox";

// ✅ Comandos staff
import { cmdStaffList } from "../commands/stafflist";
import { cmdAddAdmin } from "../commands/addadmin";
import { cmdRemoveAdmin } from "../commands/removeadmin";
import { cmdAddHeadAdmin } from "../commands/addhead-admin";
import { cmdRemoveHeadAdmin } from "../commands/removehead-admin";

// ✅ XP con aprobación (estos reciben 3 argumentos)
import { cmdAddXp } from "../commands/addxp";
import { cmdRemoveXp } from "../commands/removexp";

// ✅ Generales
import { cmdSetGeneral } from "../commands/setgeneral";
import { cmdRemoveGeneral } from "../commands/removegeneral";

async function runCommandSafely(
  commandName: string,
  message: any,
  fn: () => Promise<void>
) {
  try {
    await fn();
  } catch (err) {
    console.error(`❌ Error ejecutando comando "${commandName}":`, err);
    try {
      await message.reply("❌ Ocurrió un error ejecutando el comando.");
    } catch {}
  }
}

// ✅ IMPORTANTE: ahora recibe (client, message)
export async function handleMessage(client: any, message: any) {
  try {
    if (!message?.content) return;
    if (message.author?.bot) return;

    const prefix = settings.prefix || "!";
    if (!message.content.startsWith(prefix)) return;

    const content = message.content.slice(prefix.length).trim();
    if (!content) return;

    const parts = content.split(/\s+/);
    const command = (parts[0] || "").toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      // ✅ Usuario
      case "ayuda":
        return runCommandSafely(command, message, async () => cmdAyuda(message));

      case "perfil":
        return runCommandSafely(command, message, async () => cmdPerfil(message));

      case "setroblox":
        return runCommandSafely(command, message, async () => cmdSetRoblox(message));

      // ✅ Staff
      case "stafflist":
        return runCommandSafely(command, message, async () => cmdStaffList(message));

      case "addadmin":
        return runCommandSafely(command, message, async () => cmdAddAdmin(message));

      case "removeadmin":
        return runCommandSafely(command, message, async () => cmdRemoveAdmin(message));

      case "addhead-admin":
      case "addheadadmin":
        return runCommandSafely(command, message, async () => cmdAddHeadAdmin(message));

      case "removehead-admin":
      case "removeheadadmin":
        return runCommandSafely(command, message, async () => cmdRemoveHeadAdmin(message));

      // ✅ XP (estos reciben 3 argumentos)
      case "addxp":
        return runCommandSafely(command, message, async () =>
          cmdAddXp(client, message, args)
        );

      case "removexp":
        return runCommandSafely(command, message, async () =>
          cmdRemoveXp(client, message, args)
        );

      // ✅ Generales
      case "setgeneral":
        return runCommandSafely(command, message, async () => cmdSetGeneral(message));

      case "removegeneral":
        return runCommandSafely(command, message, async () => cmdRemoveGeneral(message));

      default:
        return runCommandSafely(command, message, async () => {
          await message.reply(
            `❌ Comando desconocido: \`${prefix}${command}\`\n` +
              `Usa \`${prefix}ayuda\` para ver los comandos disponibles.`
          );
        });
    }
  } catch (err) {
    console.error("❌ Error en message handler:", err);
  }
}
