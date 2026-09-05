/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `connection_request` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "connection_request_email_key" ON "connection_request"("email");
