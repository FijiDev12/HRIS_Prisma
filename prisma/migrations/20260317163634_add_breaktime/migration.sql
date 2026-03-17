/*
  Warnings:

  - You are about to drop the column `breakMinutes` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `requiredMinutes` on the `Shift` table. All the data in the column will be lost.
  - The `startTime` column on the `Shift` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endTime` column on the `Shift` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `flexStart` column on the `Shift` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `flexEnd` column on the `Shift` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "breakMinutes",
DROP COLUMN "requiredMinutes",
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3),
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3),
DROP COLUMN "flexStart",
ADD COLUMN     "flexStart" TIMESTAMP(3),
DROP COLUMN "flexEnd",
ADD COLUMN     "flexEnd" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BreakTime" (
    "id" SERIAL NOT NULL,
    "shiftId" INTEGER NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "duration" INTEGER,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isFlexible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BreakTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BreakTime_shiftId_idx" ON "BreakTime"("shiftId");

-- CreateIndex
CREATE INDEX "BreakTime_deletedAt_idx" ON "BreakTime"("deletedAt");

-- CreateIndex
CREATE INDEX "EmployeeShift_shiftId_idx" ON "EmployeeShift"("shiftId");

-- CreateIndex
CREATE INDEX "EmployeeShift_deletedAt_idx" ON "EmployeeShift"("deletedAt");

-- CreateIndex
CREATE INDEX "Shift_deletedAt_idx" ON "Shift"("deletedAt");

-- AddForeignKey
ALTER TABLE "BreakTime" ADD CONSTRAINT "BreakTime_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
