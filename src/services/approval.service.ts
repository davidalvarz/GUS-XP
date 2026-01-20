import { prisma } from "../db/prisma";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { listHeadAdmins } from "./staff.service";

export async function createApprovalRequest(params: {
  requestedById: string;
  targetUserId: string;
  amount: number;
  reason?: string;
}) {
  return prisma.approvalRequest.create({
    data: {
      requestedById: params.requestedById,
      targetUserId: params.targetUserId,
      amount: params.amount,
      reason: params.reason ?? "",
      status: "PENDING"
    }
  });
}

export function buildApprovalButtons(requestId: string) {
  const approveBtn = new ButtonBuilder()
    .setCustomId(`xp_approve:${requestId}`)
    .setLabel("Aprobar")
    .setStyle(ButtonStyle.Success);

  const denyBtn = new ButtonBuilder()
    .setCustomId(`xp_deny:${requestId}`)
    .setLabel("Rechazar")
    .setStyle(ButtonStyle.Danger);

  return [new ActionRowBuilder<ButtonBuilder>().addComponents(approveBtn, denyBtn)];
}

export async function buildHeadAdminPingText(): Promise<string> {
  const headAdmins = await listHeadAdmins();
  if (headAdmins.length === 0) return "";
  return headAdmins.map((id: string) => `<@${id}>`).join(" ");
}
