/*
  Warnings:

  - A unique constraint covering the columns `[customerId,month,year]` on the table `bills` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bills_customerId_month_year_key" ON "bills"("customerId", "month", "year");
