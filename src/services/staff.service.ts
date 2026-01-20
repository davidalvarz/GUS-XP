import { prisma } from "../db/prisma";

export type StaffRole = "ADMIN" | "HEAD_ADMIN";

export async function addStaff(discordId: string, role: StaffRole) {
  return prisma.staffMember.upsert({
    where: { discordId },
    create: { discordId, role },
    update: { role }
  });
}

export async function removeStaff(discordId: string) {
  return prisma.staffMember.delete({ where: { discordId } }).catch(() => null);
}

export async function getStaffRole(discordId: string): Promise<StaffRole | null> {
  const staff = await prisma.staffMember.findUnique({ where: { discordId } });
  return (staff?.role as StaffRole) ?? null;
}

export async function isAdmin(discordId: string): Promise<boolean> {
  const role = await getStaffRole(discordId);
  return role === "ADMIN" || role === "HEAD_ADMIN";
}

export async function isHeadAdmin(discordId: string): Promise<boolean> {
  const role = await getStaffRole(discordId);
  return role === "HEAD_ADMIN";
}

export async function listHeadAdmins(): Promise<string[]> {
  const heads = await prisma.staffMember.findMany({
    where: { role: "HEAD_ADMIN" },
    select: { discordId: true }
  });

  return heads.map((h: { discordId: string }) => h.discordId);
}
