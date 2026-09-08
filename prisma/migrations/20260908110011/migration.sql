/*
  Warnings:

  - You are about to drop the column `collectedById` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "collectedById",
ADD COLUMN     "collectorId" TEXT;
