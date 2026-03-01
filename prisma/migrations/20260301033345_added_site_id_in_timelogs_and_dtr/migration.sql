/*
  Warnings:

  - Added the required column `siteId` to the `DTR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteId` to the `TimeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DTR" ADD COLUMN     "siteId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TimeLog" ADD COLUMN     "siteId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DTR" ADD CONSTRAINT "DTR_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
