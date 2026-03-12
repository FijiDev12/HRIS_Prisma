/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `RestDay` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId,restDate]` on the table `RestDay` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restDate` to the `RestDay` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RestDay_employeeId_dayOfWeek_key";

-- AlterTable
ALTER TABLE "RestDay" DROP COLUMN "dayOfWeek",
ADD COLUMN     "restDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RestDay_employeeId_restDate_key" ON "RestDay"("employeeId", "restDate");
