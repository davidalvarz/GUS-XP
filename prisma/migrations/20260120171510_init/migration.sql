/*
  Warnings:

  - The `role` column on the `StaffMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `robloxName` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `robloxUserId` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the `PendingXpRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'HEAD_ADMIN');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- AlterTable
ALTER TABLE "StaffMember" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "role",
ADD COLUMN     "role" "StaffRole" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "robloxName",
DROP COLUMN "robloxUserId",
ADD COLUMN     "robloxUsername" TEXT DEFAULT '',
ALTER COLUMN "generalRank" SET DEFAULT '';

-- DropTable
DROP TABLE "PendingXpRequest";

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT DEFAULT '',
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT DEFAULT '',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);
