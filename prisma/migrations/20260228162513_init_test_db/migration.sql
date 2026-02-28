/*
  Warnings:

  - The values [ALLOWANCE] on the enum `PayrollItemType` will be removed. If these variants are still used in the database, this will fail.
  - The values [POSTED,PAID] on the enum `PayrollStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `netSalary` on the `Payroll` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PayrollItem` table. All the data in the column will be lost.
  - You are about to drop the `PayrollAudit` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[type]` on the table `GovContribution` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PayrollItemType_new" AS ENUM ('EARNING', 'DEDUCTION', 'EMPLOYER_CONTRIBUTION');
ALTER TABLE "PayrollItem" ALTER COLUMN "type" TYPE "PayrollItemType_new" USING ("type"::text::"PayrollItemType_new");
ALTER TYPE "PayrollItemType" RENAME TO "PayrollItemType_old";
ALTER TYPE "PayrollItemType_new" RENAME TO "PayrollItemType";
DROP TYPE "public"."PayrollItemType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PayrollStatus_new" AS ENUM ('DRAFT', 'APPROVED', 'LOCKED', 'REVERSED');
ALTER TABLE "public"."Payroll" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."PayrollPeriod" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PayrollPeriod" ALTER COLUMN "status" TYPE "PayrollStatus_new" USING ("status"::text::"PayrollStatus_new");
ALTER TABLE "Payroll" ALTER COLUMN "status" TYPE "PayrollStatus_new" USING ("status"::text::"PayrollStatus_new");
ALTER TYPE "PayrollStatus" RENAME TO "PayrollStatus_old";
ALTER TYPE "PayrollStatus_new" RENAME TO "PayrollStatus";
DROP TYPE "public"."PayrollStatus_old";
ALTER TABLE "Payroll" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
ALTER TABLE "PayrollPeriod" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_payrollPeriodId_fkey";

-- AlterTable
ALTER TABLE "Payroll" DROP COLUMN "netSalary",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" INTEGER,
ADD COLUMN     "employerShare" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "grossPay" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "netPay" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PayrollItem" DROP COLUMN "deletedAt";

-- DropTable
DROP TABLE "PayrollAudit";

-- CreateTable
CREATE TABLE "ThirteenthMonthLedger" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "payrollId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ThirteenthMonthLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GovContribution_type_key" ON "GovContribution"("type");

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_payrollPeriodId_fkey" FOREIGN KEY ("payrollPeriodId") REFERENCES "PayrollPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirteenthMonthLedger" ADD CONSTRAINT "ThirteenthMonthLedger_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirteenthMonthLedger" ADD CONSTRAINT "ThirteenthMonthLedger_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
