/*
  Warnings:

  - You are about to drop the column `grossSalary` on the `Payroll` table. All the data in the column will be lost.
  - Added the required column `basicSalary` to the `Payroll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payroll" DROP COLUMN "grossSalary",
ADD COLUMN     "basicSalary" DECIMAL(12,2) NOT NULL;
