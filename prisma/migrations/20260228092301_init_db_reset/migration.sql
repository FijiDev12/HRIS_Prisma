/*
  Warnings:

  - Added the required column `basicSalary` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Payroll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "basicSalary" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "status" "PayrollStatus" NOT NULL;
