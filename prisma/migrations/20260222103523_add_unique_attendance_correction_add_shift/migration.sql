/*
  Warnings:

  - You are about to drop the column `latitude` on the `AttendanceCorrection` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `AttendanceCorrection` table. All the data in the column will be lost.
  - You are about to drop the column `selfie` on the `AttendanceCorrection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AttendanceCorrection" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "selfie",
ADD COLUMN     "correctedTime" TEXT,
ADD COLUMN     "shiftId" INTEGER,
ALTER COLUMN "correctedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "AttendanceCorrection" ADD CONSTRAINT "AttendanceCorrection_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
