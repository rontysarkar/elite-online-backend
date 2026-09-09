/*
  Warnings:

  - You are about to drop the column `gatewayPayload` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gatewayPayload",
ADD COLUMN     "gatewayResponse" JSONB,
ADD COLUMN     "merchantInvoiceNumber" TEXT,
ADD COLUMN     "paymentId" TEXT;
