/*
  Warnings:

  - You are about to drop the column `createAT` on the `bills` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bills" DROP COLUMN "createAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
