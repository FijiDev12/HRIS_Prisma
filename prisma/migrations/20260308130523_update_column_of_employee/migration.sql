/*
  Warnings:

  - You are about to drop the column `tempPassword` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "tempPassword" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tempPassword";
