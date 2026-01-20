import { settings } from "../config/settings";
import { cmdPerfil } from "../commands/perfil";
import { cmdSetRoblox } from "../commands/setroblox";
import { cmdAddXp } from "../commands/addxp";
import { cmdRemoveXp } from "../commands/removexp";
import { cmdSetGeneral } from "../commands/setgeneral";
import { cmdAyuda } from "../commands/ayuda";
import { cmdAddAdmin } from "../commands/addadmin";
import { cmdRemoveAdmin } from "../commands/removeadmin";
import { cmdAddHeadAdmin } from "../commands/addhead-admin";
import { cmdRemoveHeadAdmin } from "../commands/removehead-admin";


export async function handleMessage(client: any, message: any) {
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.prefix)) return;

  const args = message.content.slice(settings.prefix.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  if (!command) return;

  switch (command) {case "addadmin":
  return cmdAddAdmin(message);

case "removeadmin":
  return cmdRemoveAdmin(message);

case "addhead-admin":
  return cmdAddHeadAdmin(message);

case "removehead-admin":
  return cmdRemoveHeadAdmin(message);

    case "ayuda":
  return cmdAyuda(message);
     case "perfil":
      return cmdPerfil(message);
    case "setroblox":
      return cmdSetRoblox(message, args);
    case "addxp":
      return cmdAddXp(client, message, args);
    case "removexp":
      return cmdRemoveXp(client, message, args);
    case "setgeneral":
      return cmdSetGeneral(message, args);
    default:
      return;
  }
}
