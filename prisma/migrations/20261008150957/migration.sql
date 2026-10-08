-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
