import { prisma } from "../db/prisma";
import { settings } from "../config/settings";

export async function isHeadAdmin(discordId: string): Promise<boolean> {
  // ✅ OWNER_ID siempre tiene permisos supremos
  if (settings.ownerId && discordId === settings.ownerId) return true;

  const staff = await prisma.staffMember.findUnique({
    where: { discordId }
  });

  return staff?.role === "HEAD_ADMIN";
}

export async function isAdmin(discordId: string): Promise<boolean> {
  // ✅ OWNER_ID también cuenta como admin
  if (settings.ownerId && discordId === settings.ownerId) return true;

  const staff = await prisma.staffMember.findUnique({
    where: { discordId }
  });

  return staff?.role === "ADMIN" || staff?.role === "HEAD_ADMIN";
}

/**
 * ✅ Seed: si NO hay Head-Admins en DB, crea uno (OWNER_ID)
 * Esto solo corre 1 vez y queda persistido.
 */
export async function seedFirstHeadAdmin() {
  if (!settings.ownerId) return;

  const count = await prisma.staffMember.count({
    where: { role: "HEAD_ADMIN" }
  });

  if (count > 0) return;

  await prisma.staffMember.upsert({
    where: { discordId: settings.ownerId },
    create: {
      discordId: settings.ownerId,
      role: "HEAD_ADMIN"
    },
    update: {
      role: "HEAD_ADMIN"
    }
  });

  console.log(`✅ Seed completado: OWNER_ID agregado como HEAD_ADMIN (${settings.ownerId})`);
}
