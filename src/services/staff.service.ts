import { prisma } from "../db/prisma";
import { settings } from "../config/settings";

export type StaffRole = "ADMIN" | "HEAD_ADMIN";

function isOwner(discordId: string) {
  return settings.ownerId && discordId === settings.ownerId;
}

/* =========================
   ✅ CHECKS DE PERMISOS
========================= */

export async function isHeadAdmin(discordId: string): Promise<boolean> {
  if (isOwner(discordId)) return true;

  const staff = await prisma.staffMember.findUnique({
    where: { discordId }
  });

  return staff?.role === "HEAD_ADMIN";
}

export async function isAdmin(discordId: string): Promise<boolean> {
  if (isOwner(discordId)) return true;

  const staff = await prisma.staffMember.findUnique({
    where: { discordId }
  });

  return staff?.role === "ADMIN" || staff?.role === "HEAD_ADMIN";
}

/* =========================
   ✅ CRUD STAFF
========================= */

export async function addAdmin(discordId: string) {
  return prisma.staffMember.upsert({
    where: { discordId },
    create: { discordId, role: "ADMIN" },
    update: { role: "ADMIN" }
  });
}

export async function addHeadAdmin(discordId: string) {
  return prisma.staffMember.upsert({
    where: { discordId },
    create: { discordId, role: "HEAD_ADMIN" },
    update: { role: "HEAD_ADMIN" }
  });
}

export async function removeAdmin(discordId: string) {
  const staff = await prisma.staffMember.findUnique({ where: { discordId } });
  if (!staff) return null;

  if (staff.role === "HEAD_ADMIN") return staff; // no se baja head-admin con removeAdmin
  return prisma.staffMember.delete({ where: { discordId } });
}

export async function removeHeadAdmin(discordId: string) {
  // ✅ OWNER supremo nunca se puede remover
  if (isOwner(discordId)) return null;

  const staff = await prisma.staffMember.findUnique({ where: { discordId } });
  if (!staff) return null;

  return prisma.staffMember.delete({ where: { discordId } });
}

export async function getStaffRole(discordId: string): Promise<StaffRole | null> {
  if (isOwner(discordId)) return "HEAD_ADMIN";

  const staff = await prisma.staffMember.findUnique({
    where: { discordId },
    select: { role: true }
  });

  return (staff?.role as StaffRole) ?? null;
}

/* =========================
   ✅ LISTAS (para stafflist / aprobaciones)
========================= */

export async function listHeadAdmins(): Promise<string[]> {
  const rows = await prisma.staffMember.findMany({
    where: { role: "HEAD_ADMIN" },
    select: { discordId: true },
    orderBy: { createdAt: "asc" }
  });

  const list = rows.map((r) => r.discordId);

  // ✅ aseguramos que el OWNER esté siempre al inicio
  if (settings.ownerId && !list.includes(settings.ownerId)) {
    list.unshift(settings.ownerId);
  }

  return list;
}

export async function listAdmins(): Promise<string[]> {
  const rows = await prisma.staffMember.findMany({
    where: { role: "ADMIN" },
    select: { discordId: true },
    orderBy: { createdAt: "asc" }
  });

  return rows.map((r) => r.discordId);
}

/* =========================
   ✅ SEED AUTOMÁTICO
========================= */

export async function seedFirstHeadAdmin() {
  if (!settings.ownerId) {
    console.log("⚠️ OWNER_ID no está configurado. Seed omitido.");
    return;
  }

  // si ya existe algún head-admin en DB, no hacemos nada
  const count = await prisma.staffMember.count({
    where: { role: "HEAD_ADMIN" }
  });

  if (count > 0) return;

  // ✅ insertamos al owner como HEAD_ADMIN inicial
  await addHeadAdmin(settings.ownerId);

  console.log(`✅ Seed completado: OWNER_ID agregado como HEAD_ADMIN (${settings.ownerId})`);
}
