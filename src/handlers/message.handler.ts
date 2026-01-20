import { settings } from "../config/settings";

// Comandos
import { cmdPerfil } from "../commands/perfil";
import { cmdSetRoblox } from "../commands/setroblox";
import { cmdAddXp } from "../commands/addxp";
import { cmdRemoveXp } from "../commands/removexp";
import { cmdSetGeneral } from "../commands/setgeneral";
import { cmdAyuda } from "../commands/ayuda";

// Staff management (Head-Admin only)
import { cmdAddAdmin } from "../commands/addadmin";
import { cmdRemoveAdmin } from "../commands/removeadmin";
import { cmdAddHeadAdmin } from "../commands/addhead-admin";
import { cmdRemoveHeadAdmin } from "../commands/removehead-admin";

/**
 * Respuesta segura (no crashea si el bot no puede responder).
 */
async function safeReply(message: any, content: any) {
  try {
    return await message.reply(content);
  } catch (err) {
    try {
      // fallback: intentar enviar al canal
      if (message.channel && message.channel.send) {
        return await message.channel.send(content);
      }
    } catch {
      // no se puede responder
    }
  }
}

/**
 * Ejecuta comandos de forma segura:
 * - Captura errores
 * - Loguea error real
 * - Responde error amigable
 */
async function runCommandSafely(commandName: string, message: any, fn: () => Promise<any>) {
  try {
    await fn();
  } catch (error: any) {
    console.error(`❌ Error ejecutando comando: ${commandName}`);
    console.error(error);

    await safeReply(message, {
      content:
        `⚠️ Ocurrió un error ejecutando el comando **${settings.prefix}${commandName}**.\n` +
        `✅ El error ya fue registrado en los logs.\n` +
        `📌 Si sigue pasando, revisa permisos del bot o variables en Railway.`
    });
  }
}

export async function handleMessage(client: any, message: any) {
  // ✅ Anti bots
  if (!message || !message.content || message.author?.bot) return;

  // ✅ Prefijo
  if (!message.content.startsWith(settings.prefix)) return;

  const args = message.content.slice(settings.prefix.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();
  if (!command) return;

  // ✅ Switch con ejecución segura
  switch (command) {
    case "ayuda":
      return runCommandSafely(command, message, async () => cmdAyuda(message));

    case "perfil":
      return runCommandSafely(command, message, async () => cmdPerfil(message));

    case "setroblox":
      return runCommandSafely(command, message, async () => cmdSetRoblox(message, args));

    case "addxp":
      return runCommandSafely(command, message, async () => cmdAddXp(client, message, args));

    case "removexp":
      return runCommandSafely(command, message, async () => cmdRemoveXp(client, message, args));

    case "setgeneral":
      return runCommandSafely(command, message, async () => cmdSetGeneral(message, args));

    case "addadmin":
      return runCommandSafely(command, message, async () => cmdAddAdmin(message));

    case "removeadmin":
      return runCommandSafely(command, message, async () => cmdRemoveAdmin(message));

    case "addhead-admin":
      return runCommandSafely(command, message, async () => cmdAddHeadAdmin(message));

    case "removehead-admin":
      return runCommandSafely(command, message, async () => cmdRemoveHeadAdmin(message));

    default:
      return;
  }
}
