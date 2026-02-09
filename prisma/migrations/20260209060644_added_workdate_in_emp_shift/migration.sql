/*
  Warnings:

  - Added the required column `workDate` to the `EmployeeShift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeShift" ADD COLUMN     "workDate" TIMESTAMP(3) NOT NULL;
