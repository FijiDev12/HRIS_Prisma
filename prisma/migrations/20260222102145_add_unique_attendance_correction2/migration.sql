/*
  Warnings:

  - You are about to drop the column `approverPositionId` on the `AttendanceCorrection` table. All the data in the column will be lost.
  - You are about to drop the column `correctedTime` on the `AttendanceCorrection` table. All the data in the column will be lost.
  - You are about to drop the column `correctionType` on the `AttendanceCorrection` table. All the data in the column will be lost.
  - You are about to drop the column `originalTime` on the `AttendanceCorrection` table. All the data in the column will be lost.
  - You are about to drop the column `workDate` on the `AttendanceCorrection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId,type,logDate]` on the table `AttendanceCorrection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correctedAt` to the `AttendanceCorrection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logDate` to the `AttendanceCorrection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `AttendanceCorrection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttendanceCorrection" DROP CONSTRAINT "AttendanceCorrection_approverId_fkey";

-- DropIndex
DROP INDEX "AttendanceCorrection_employeeId_idx";

-- DropIndex
DROP INDEX "AttendanceCorrection_employeeId_workDate_correctionType_key";

-- DropIndex
DROP INDEX "AttendanceCorrection_workDate_idx";

-- AlterTable
ALTER TABLE "AttendanceCorrection" DROP COLUMN "approverPositionId",
DROP COLUMN "correctedTime",
DROP COLUMN "correctionType",
DROP COLUMN "originalTime",
DROP COLUMN "workDate",
ADD COLUMN     "correctedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "logDate" TEXT NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "selfie" TEXT,
ADD COLUMN     "type" "CorrectionType" NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "profilePhoto" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceCorrection_employeeId_type_logDate_key" ON "AttendanceCorrection"("employeeId", "type", "logDate");

-- AddForeignKey
ALTER TABLE "AttendanceCorrection" ADD CONSTRAINT "AttendanceCorrection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
