/*
  Warnings:

  - Changed the type of `type` on the `AttendanceCorrection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AttendanceCorrection" DROP COLUMN "type",
ADD COLUMN     "type" "LogType" NOT NULL;

-- DropEnum
DROP TYPE "CorrectionType";

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceCorrection_employeeId_type_logDate_key" ON "AttendanceCorrection"("employeeId", "type", "logDate");
