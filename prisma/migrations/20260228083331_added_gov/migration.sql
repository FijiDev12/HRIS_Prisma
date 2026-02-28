-- CreateEnum
CREATE TYPE "GovType" AS ENUM ('SSS', 'PHILHEALTH', 'PAGIBIG');

-- AlterTable
ALTER TABLE "PayrollItem" ADD COLUMN     "govContributionId" INTEGER;

-- CreateTable
CREATE TABLE "PayrollAudit" (
    "id" SERIAL NOT NULL,
    "payrollPeriodId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayrollAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovContribution" (
    "id" SERIAL NOT NULL,
    "type" "GovType" NOT NULL,
    "minSalary" DECIMAL(12,2) NOT NULL,
    "maxSalary" DECIMAL(12,2) NOT NULL,
    "employeeShare" DECIMAL(12,2) NOT NULL,
    "employerShare" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovContribution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayrollItem" ADD CONSTRAINT "PayrollItem_govContributionId_fkey" FOREIGN KEY ("govContributionId") REFERENCES "GovContribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
