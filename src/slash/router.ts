import { cmdSlashAyuda } from "./commands/ayuda";
import { cmdSlashSetRoblox } from "./commands/setroblox";
import { cmdSlashPerfil } from "./commands/perfil";

export const slashCommands = new Map<string, any>([
  ["ayuda", cmdSlashAyuda],
  ["setroblox", cmdSlashSetRoblox],
  ["perfil", cmdSlashPerfil]
]);
